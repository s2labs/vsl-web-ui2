import DS from 'ember-data';

var Position = DS.Model.extend({
  device: DS.belongsTo('device'),
  center: DS.attr('coordinate') // [76.7907, -93.2402] 
  
});

export default Position;