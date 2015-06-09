
/* global L */
import EmberLeafletComponent from 'ember-leaflet/components/leaflet-map';
//import Layer from 'ember-leaflet/layers/layer';
import MarkerCollectionLayer from 'ember-leaflet/layers/marker-collection';
import TileLayer from 'ember-leaflet/layers/tile';
//import DefaultLayer from 'ember-leaflet/layers/default-tile';

export default EmberLeafletComponent.extend({
  //center: L.latLng(48.2628, 11.6685),
  center: L.latLng(78, -90),
  zoom: 4, 
  //options: {maxZoom: 19, minZoom: 0},
  
  didCreateLayer: function() {
    this._super();
    L.control.layers(this.childLayers[1]).addTo(this._layer);
    L.control.scale().addTo(this._layer);
    
    L.control.coordinates({
      //position:"bottomright", //optional default "bootomright"
      //decimals:6, //optional default 4
      //decimalSeperator:".", //optional default "."
      //labelTemplateLat:"Latitude: {y}", //optional default "Lat: {y}"
      //labelTemplateLng:"Longitude: {x}", //optional default "Lng: {x}"
      enableUserInput: false, //optional default true
      //useDMS:false, //optional default false
      useLatLngOrder: true //ordering of labels, default false-> lng-lat
   }).addTo(this._layer);
  },
  childLayers: [
    /*
    Layer.extend({
      _newLayer: function() {
        return new L.Grid();
      }
    }),*/
  

    TileLayer.extend({
      tileUrl: 'http://ds2os-web/img/maps/fmi/{z}/{y}_{x}.png',
      options: {
        minZoom: 3, maxZoom: 7
        //bounds: [ [48.2611572, 11.6652150], [48.263605, 11.6692725]] // Values from old webinterface, lines 5650 ff
      }
    }),
    //DefaultLayer
    MarkerCollectionLayer.extend({
      contentBinding: 'model'
    })
  ]
});
