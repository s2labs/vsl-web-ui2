import Ember from 'ember';

export default Ember.Route.extend({
    
  model: function() {
    return this.store.findAll('position');
  },

  communication: Ember.inject.service(),
  
  init: function() {
    this.get('communication');
  },

});
