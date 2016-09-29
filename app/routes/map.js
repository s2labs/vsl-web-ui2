import Ember from 'ember';

export default Ember.Route.extend({
    
  model: function() {
    return this.store.findAll('position');
  },
  
  //will load the service in file /app/services/communication.js
  communication: Ember.inject.service(),
  
  init: function() {
    this.get('communication');
  }

});
