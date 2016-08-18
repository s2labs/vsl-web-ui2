import BasicComposed from 'web-ui2/components/basic-composed';

export default BasicComposed.extend({
  // reuse the existing hbs template from basic-composed
  layoutName: "components/basic-composed",

  //https://github.com/coryasilva/Leaflet.ExtraMarkers#properties
  icon: function(model) {
    return new L.ExtraMarkers.icon({
      // IDEA change color based on model.children['isOn'].value between white and yellow
      markerColor: 'white',
      shape: 'circle'
    });
  }
});