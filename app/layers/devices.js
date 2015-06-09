import MarkerLayer from 'ember-leaflet/layers/marker';

export default MarkerLayer.extend({
  click: function() { alert('hi!'); },
  dblclick: function() { alert('hi again!'); }
});