// TODO: Rename class from device-renderer to e.g. node-renderer or item-renderer, or whateverta


import Ember from 'ember';

export default Ember.Component.extend({

includes: function() {
    return this.get('type').includes('/derived/percent');
  }.property('type'),

});
