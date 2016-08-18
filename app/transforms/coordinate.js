import DS from 'ember-data';
/* global L */

export default DS.Transform.extend({
  deserialize: function(value) {
    return L.latLng(value);
  },

  serialize: function(value) {
    if (value['lat']) {
      return [value['lat'], value['lng'], value['alt']];
    } else {
      return value;
    }
  }
});
