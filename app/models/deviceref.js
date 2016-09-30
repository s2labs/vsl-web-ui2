import DS from 'ember-data';

var Deviceref = DS.Model.extend({
  device: DS.belongsTo('device'),
  
});

export default Deviceref;