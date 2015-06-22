
/* global L */
import EmberLeafletComponent from 'ember-leaflet/components/leaflet-map';
import MarkerCollectionLayer from 'ember-leaflet/layers/marker-collection';
import MarkerClusterLayer from 'ember-leaflet/layers/marker-cluster';
import TileLayer from 'ember-leaflet/layers/tile';
//import Layer from 'ember-leaflet/layers/layer';
//import DefaultLayer from 'ember-leaflet/layers/default-tile';

export default EmberLeafletComponent.extend({
  center: L.latLng(78, -90),
  zoom: 4, 
  
  didCreateLayer: function() {
    this._super();
    //L.control.layers(this.childLayers[1]).addTo(this._layer);
  },
  childLayers: [
    TileLayer.extend({
      /*tileUrl: 'http://ds2os-web/img/maps/fmi/{z}/{y}_{x}.png',*/
      tileUrl: '/assets/maps/fmi/{z}/{y}_{x}.png',
      options: {
        minZoom: 3, maxZoom: 7
        //bounds: [ [48.2611572, 11.6652150], [48.263605, 11.6692725]] // Values from old webinterface, lines 5650 ff
      }
    }),
    MarkerClusterLayer.extend({
      childLayers: [MarkerCollectionLayer.extend({
        content: function(){
            return this.controller.get('model');
          }//.property('location')
      })]
    })

    
  ]
});
