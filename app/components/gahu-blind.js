import BasicComposed from 'web-ui2/components/basic-composed';

export default BasicComposed.extend({
  // reuse the existing hbs template from basic-composed
  layoutName: "components/basic-composed",

  //https://github.com/coryasilva/Leaflet.ExtraMarkers#properties
  icon: function() {
    return new L.ExtraMarkers.icon({
      markerColor: 'cyan',
      shape: 'square',
      innerHTML: '<img src="img/fts_shutter.png" width="32" />'
    });
  }
});