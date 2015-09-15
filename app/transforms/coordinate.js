import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize: function(value) {
    return value;
  },

  serialize: function(value) {
    if (value['lat']) {
      return [value['lat'], value['lng']];
    } else {
      return value;
    }
  }
});
