import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  type: DS.attr('string'),
  version: DS.attr('number'),
  timeStamp: DS.attr('date'),
  access: DS.attr('string'),
  //children: DS.hasMany('dobject')
});
