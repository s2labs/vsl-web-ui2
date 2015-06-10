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
           title: 'lamp 1',
           location: L.latLng(70.7907, -92.2302),
         },
         {
           id: 2,
           title: 'dimmable lamp 2',
           location: L.latLng(76.7907, -93.2402),
         },
         {
           id: 3,
           title: 'colored lamp 3',
           location: L.latLng(74.7907, -92.2302),
         }
    ]
});

export default Device;