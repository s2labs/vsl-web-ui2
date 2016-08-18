import Ember from 'ember';

export default Ember.Component.extend({

  icon: function() {
    return new L.Icon.Default();
  }
});