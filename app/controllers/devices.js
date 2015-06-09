/* global L */
import Ember from 'ember';

export default Ember.ArrayController.extend({
  model: [
    {location: L.latLng(75.7907, -92.2302)},
    {location: L.latLng(76.7907, -92.2302)},
    {location: L.latLng(77.7907, -92.2302)}
  ]
});