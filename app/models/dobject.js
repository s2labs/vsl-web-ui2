import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  value: DS.attr('number'), 
  // TODO wie macht man den value von Nutzerseite read-only, für Änderungen vom Backend aber schreibbar?
  //   vgl. http://www.programwitherik.com/what-are-ember-computed-properties/
  // oder ist das eher ne Frontend sache via access... eigentlich ja.
  // kann man auch schön im template loesen:
  // http://emberup.co/bindings-with-htmlbars-helpers/
  // {{my-time-input value=(readonly job.startTime) on-time-change=(action (mut job.startTime))}}
  //
  
  children: DS.hasMany('dobject', { inverse: 'parent' }),
  parent: DS.belongsTo('dobject', { inverse: 'children' }),
  
  type: DS.attr(),
  types: function() {
    var type = this.get('type');
    if ( type ) {
      return type.split(',');
    }
    return [];
  }.property('type'),
  restriction: DS.attr(),  // TODO
  //timestamp: DS.attr('number'),
  //version: DS.attr('number'),
  //access: DS.attr('string'),

  name: function() {
    var id = this.get('id');
    // return last element of vsl path
    return id.substring(id.lastIndexOf('_')+1);
  }.property('id'),
  
  
  component: function() {
    // from https://github.com/emberjs/ember.js/issues/3376#issuecomment-33163748
    var componentLookup = Ember.getOwner(this).lookup('component-lookup:main');
    
    var component = null;
    
    // interated over types and check if there is a specific render component
    for (var type of this.get('types')) {
      component = componentLookup.lookupFactory(type.substring(1).replace('/','-'));
      if ( component ) {
        // matching component was found! -> stop search
        break;
      }
    }
    
    // none was found -> use basic-composed as fallback
    if ( !component ) {
      component = componentLookup.lookupFactory('basic-composed');
    }
    
    return component;
  }.property('types'),
  
  componentName: function() {
    // from https://github.com/emberjs/ember.js/issues/3376#issuecomment-33163748
    var componentLookup = Ember.getOwner(this).lookup('component-lookup:main');
    
    var componentName = "basic-composed";
    for (var type of this.get('types')) {
      var name = type.substring(1).replace('/','-');
      if ( componentLookup.lookupFactory(name) ) {
        componentName = name;
        break;
      }
    }
    return componentName;
    
    
  }.property('types'),
  
  // temporary Workaround... replace with get-template function in device renderer
  //http://stackoverflow.com/questions/11169595/check-for-a-value-equals-to-in-ember-handlebar-if-block-helper#11177435
  isSlider: function() {
    return this.get('type').includes('/derived/percent');
  }.property('type'),
  
  
  // TOOD sollte man das ggf. debouncen, vgl. http://discuss.emberjs.com/t/how-to-update-item-without-using-save-button-option/8529/4
  // TODO hat dieser Code überhaupt was im Model zu suchen?
  watchValue: function() {
    if ( this.get('hasDirtyAttributes') ) {
      console.log('value changed');
      this.save();
    }
  }.observes('value')
});
