/* global L */
import EmberLeafletComponent from 'ember-leaflet/components/leaflet-map';
import TileLayer from 'ember-leaflet/layers/tile';

export default EmberLeafletComponent.extend({
  center: L.latLng(48.2628, 11.6685),
  zoom: 18, 
  //options: {maxZoom: 19, minZoom: 0},
  childLayers: [
    TileLayer.extend({
      tileUrl: 'http://ds2os-web/img/maps/fmi/zoom_{z}/{y}_{x}.png',
      options: {
        minZoom: 17, maxZoom: 21, zoomOffset: -1,
        bounds: [ [48.2611572, 11.6652150], [48.263605, 11.6692725]] // Values from old webinterface, lines 5650 ff
      }
    }),
    TileLayer.extend({
      tileUrl: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      options: {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }
    })
  ]
});
