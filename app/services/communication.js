import Ember from 'ember';
import config from '../config/environment';
import uuid from 'ember-uuid';

// documentation: https://github.com/thoov/ember-websockets/blob/master/README.md

// see also https://github.com/emberjs/data/issues/4563
Ember.$.ajaxSetup({
  crossDomain: true,
  xhrFields: {
    withCredentials: true
  }
});


export default Ember.Service.extend({

  websockets: Ember.inject.service(),
  store: Ember.inject.service(),
  socketRef: null,
  callbackId: '',
  resubscribeOnReconnect: false,

  init: function() {
    if (!this.get('socketRef')) {
      const socket = this.get('websockets').socketFor('wss://' + config.kaURL.split('//', 2)[1] + '/callbacks', ["v1.vsl.ds2os.org"]);
      socket.on('open', this.openHandler, this);
      socket.on('message', this.messageHandler, this);
      socket.on('close', this.closeHandler, this);
      
      this.set('socketRef', socket);
      this.set('callbackId', uuid.v4());
    }
  },
  message: '',

  willDestroyElement() {
    const socket = this.get('socketRef');

    socket.off('open', this.myOpenHandler);
    socket.off('message', this.myMessageHandler);
    socket.off('close', this.myCloseHandler);

    this._super(...arguments);
  },
  
  subscribe: function(path) {
    Ember.$.ajax({
      url: config.kaURL + path,
      type: 'POST',
      headers: { 'Content-Type' : 'application/json' },
      data: JSON.stringify({
        'operation': 'SUBSCRIBE', 
        'callbackId': this.callbackId
      })
     });
  },
  unsubscribe: function(path) {
    Ember.$.ajax({
      url: config.kaURL + path,
      type: 'POST',
      headers: { 'Content-Type' : 'application/json' },
      data: JSON.stringify({
        'operation': 'UNSUBSCRIBE', 
        'callbackId': this.callbackId
      })
     });
  },

  // resubscribe for changes on all active dobjects when KA was restarted
  resubscribe: function() {
      // iterate over all dobject which we have in our local cache aka store
      this.get('store').peekAll('dobject').forEach(function(item) {
        console.log(item.get('id'));
        item.subscribe();
      });
  },

  openHandler: function() {
    console.log('Web socket was successfully opened');
    if ( this.get('resubscribeOnReconnect') === true ){
      this.resubscribe();
    }
  },

  messageHandler: function(event) {
    const store = this.get('store');
    
    //console.log('Web socket message: ' + event.data);
    var data = JSON.parse(event.data);
    
    // dobject event.data.address notify() ?
    // from https://emberigniter.com/force-store-reload-data-api-backend/
    // update record when it is already in the local store
    if ( store.hasRecordForId('dobject', data['address'])) {
      store.findRecord('dobject', data['address'], { reload: true, adapterOptions: { scope: 'value' } });
    } else {
      console.log('ingoring update notificaiton for ' + data['address'] + '; it was not instanciated yet.');
    }
    
    // confirm received message
    this.socketRef.send({callbackId: data['callbackId'], serial: data['serial']}, true);
  },

  closeHandler: function() {
    console.log('Web scoket was closed – Is KA restarting?');
    this.set('resubscribeOnReconnect', true);
    
    // remove the old socket and try to connect to a new one on the same url 10 seconds later.
    Ember.run.later(this, () => { this.socketRef.reconnect(); }, 10000);
  }

  
});
