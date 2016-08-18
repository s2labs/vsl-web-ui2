import Ember from 'ember';

// documentation: https://github.com/thoov/ember-websockets/blob/master/README.md

export default Ember.Service.extend({

  websockets: Ember.inject.service(),
  socketRef: null,

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
  },

  myOpenHandler: function(event) {
    console.log('Web scoket was successfully opened');
    console.log(event);
    
    const socket = this.get('socketRef');
    // TODO replace with REST POST Request
    //    -> create subscribe method in dobject?
                // hmm, ne eher in nem wirklichen controller wie z.B. hier oder im ember-data apdapter...
    //socket.send({operation: 'SUBSCRIBE', 'callbackId': 'cf255f45-c442-4af8-95f7-1c054ad0093a'}, true);
  },

  myMessageHandler: function(event) {
    console.log('Web scoket message: ' + event.data);
    this.set('message', event.data);
    // TODO
    // dobject event.data.address notify() ?
  },

  myCloseHandler: function(event) {
    console.log('Web scoket was closed');
    console.log(event);
  }
  
});
