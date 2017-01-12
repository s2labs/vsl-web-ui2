import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    // TODO: type per query parameter in der URL setzen?
    return this.store.query('deviceref', {'typeSearch' : '/gahu/genericDevice'});
  },

  //will load the service in file /app/services/communication.js
  communication: Ember.inject.service(),
  
  init: function() {
    this.get('communication');
  }



});
