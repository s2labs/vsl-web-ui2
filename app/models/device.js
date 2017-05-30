import Ember from 'ember';
import DS from 'ember-data';
import Dobject from 'web-ui2/models/dobject';

var Device = Dobject.extend({
  position: DS.belongsTo('position'),

  icon: Ember.computed('componentName', function() {
    var component = Ember.getOwner(this).lookup('component:'+this.get('componentName'));
    
    // "icon" is a list with two items: icon class and args
    //  we need to create a new Leaflet Marker instance here
    //    -> call it
    var icon = component.get('icon');
    return new icon[0](icon[1]); 
  })
});

export default Device;