import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    // TODO: type per query parameter in der URL setzen?
    return this.store.query('deviceref', {'typeSearch' : '/gahu/device'});
  }
});
