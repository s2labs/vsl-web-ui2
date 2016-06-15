import DS from 'ember-data';

var Location = DS.Model.extend({
  location: DS.attr('coordinate'), // [76.7907, -93.2402] 
  device: DS.belongsTo('device'),
});

export default Location;