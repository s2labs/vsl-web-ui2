import Ember from 'ember';

// documentation: https://github.com/thoov/ember-websockets/blob/master/README.md

export default Ember.Service.extend({

  websockets: Ember.inject.service(),
  store: Ember.inject.service(),
  socketRef: null,
  callbackId: 'cf255f45-c442-4af8-95f7-1c054ad0093a',

  init: function() {
    if (!this.get('socketRef')) {
      const socket = this.get('websockets').socketFor('wss://agent2:8082/callbacks', ["v1.vsl.ds2os.org"]);
      socket.on('open', this.myOpenHandler, this);
      socket.on('message', this.myMessageHandler, this);
      socket.on('close', this.myCloseHandler, this);
      
      this.set('socketRef', socket);
    }
  },
  message: '',

  willDestroyElement() {
    const socket = this.get('socketRef');

    socket.off('open', this.myOpenHandler);
    socket.off('message', this.myMessageHandler);
    socket.off('close', this.myCloseHandler);
    
    Ember.$.ajax({
      url: 'https://agent2:8082/agent2/?depth=-1',
      type: 'POST',
      headers: { 'Content-Type' : 'application/json' },
      data: JSON.stringify({
        'operation': 'UNSUBSCRIBE', 
        'callbackId': this.callbackId
      })
     }); 
    this._super(...arguments);
  },

  myOpenHandler: function(event) {
    console.log('Web socket was successfully opened');
    //console.log(event);
    
    // curl -E ./service1.p12:XXXXXXX -D - -H "Content-Type: application/json" -d '{"operation": "SUBSCRIBE", "callbackId": "482c2560-6531-11e6-84cf-6c400891b752"}'  https://agent2:8082/agent2/gateway1
    // subscribe to all changes
    Ember.$.ajax({
      url: 'https://agent2:8082/agent2/?depth=-1',
      type: 'POST',
      headers: { 'Content-Type' : 'application/json' },
      data: JSON.stringify({
        'operation': 'SUBSCRIBE', 
        'callbackId': this.callbackId
      })
     });
  },

  myMessageHandler: function(event) {
    //const store = this.get('store');
    
    console.log('Web socket message: ' + event.data);
    var data = JSON.parse(event.data);

    // dobject event.data.address notify() ?
    // from https://emberigniter.com/force-store-reload-data-api-backend/
    var store = this.get('store');
    // update record when it is already in the local store
    if ( this.get('store').hasRecordForId('dobject', data['address'])) {
      this.get('store').findRecord('dobject', data['address'], { reload: true, adapterOptions: { scope: 'value' } });
    } else {
      console.log(data['address'] + 'was not used yet, ingoring update notificaiton');
    }
    
    // confirm received message
    this.socketRef.send({callbackId: data['callbackId'], serial: data['serial']}, true);
  },

  myCloseHandler: function(event) {
    console.log('Web scoket was closed – Is KA restarting?');
    
    // remove the old socket and try to connect to a new one on the same url 10 seconds later.
    Ember.run.later(this, () => { socketRef.reconnect(); }, 10000);
    
    //console.log(event);

  }

  
});
