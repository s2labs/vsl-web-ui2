import Ember from 'ember';

export default Ember.Component.extend({

  icon: Ember.computed(function() {
    console.log('basic composed icon() was called');
    return [L.Icon.Default, {}];
  }),
  }
});