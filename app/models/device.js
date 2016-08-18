import Ember from 'ember';
import DS from 'ember-data';
import Dobject from 'web-ui2/models/dobject';

var Device = Dobject.extend({
  position: DS.belongsTo('position'),

  icon: Ember.computed('componentName', function() {
    var component = Ember.getOwner(this).lookup('component:'+this.get('componentName'));
    // icon attribute is a funciton which return new Leaflet Marker instance -> call it
    return component.get('icon')();
  })
});

export default Device;