/* global L */
import DS from 'ember-data';

var Device = DS.Model.extend({
  title: DS.attr('string'),
  location: DS.attr(),
});

Device.reopenClass({
    FIXTURES: [
        {
           id: 1,
           title: 'Learn Ember.js',
           location: L.latLng(75.7907, -92.2302),
         },
         {
           id: 2,
           title: '...',
           location: L.latLng(76.7907, -92.2302),
         },
         {
           id: 3,
           title: 'Profit!',
           location: L.latLng(74.7907, -92.2302),
         }
    ]
});

export default Device;