import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  value: DS.attr('number'), 
  types: DS.attr( { defaultValue: function(){ return []; } } ),
  restrictions: DS.attr( { defaultValue: function(){ return {}; } } ),  // TODO
  //timestamp: DS.attr('number'),
  //version: DS.attr('number'),
  access: DS.attr('string'),

  children: DS.hasMany('dobject', { inverse: 'parent' }),
  parent: DS.belongsTo('dobject', { inverse: 'children' }),
  
  name: function() {
    var id = this.get('id');
    // return last element of vsl path
    return id.substring(id.lastIndexOf('/')+1);
  }.property('id'),
  
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
  
  isMAPE: function() {
    for (var type of this.get('types')) {
      if ( type.includes('/mape') ) {
        return true;
      }
    }
    return false;

  }.property('types'),
  
  isReadonly: function() {
    if ( this.get('access') == 'r' && !this.get('isMAPE') ) {
      return true;
    }
    return false;
  }.property('access', 'isMAPE'),
  
  
  // TOOD sollte man das ggf. debouncen, vgl. http://discuss.emberjs.com/t/how-to-update-item-without-using-save-button-option/8529/4
  // TODO hat dieser Code überhaupt was im Model zu suchen?
  watchValue: function() {
    if ( this.get('hasDirtyAttributes') ) {
      console.log('value changed');
      this.save();
    }
  }.observes('value')
});
