import Ember from 'ember';

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
    console.log('On open event has been called: ' + event);
    const socket = this.get('socketRef');
    
  },

  myMessageHandler: function(event) {
    console.log('Message: ' + event.data);
    this.set('message', event.data);
  },

  myCloseHandler: function(event) {
    console.log(`On close event has been called: ${event}`);
  }
  
});
