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
  
  restriction: DS.attr(),  // TODO
  type: DS.attr( { defaultValue: function(){ return []; } } ),
  //timestamp: DS.attr('number'),
  //version: DS.attr('number'),
  //access: DS.attr('string'),

  name: function() {
    var id = this.get('id');
    // return last element of vsl path
    return id.substring(id.lastIndexOf('_')+1);
  }.property('id'),
  
  componentName: function() {
    // from https://github.com/emberjs/ember.js/issues/3376#issuecomment-33163748
    var componentLookup = Ember.getOwner(this).lookup('component-lookup:main');
    
    var componentName = "basic-composed";
    for (var type of this.get('type')) {
      var name = type.substring(1).replace('/','-');
      if ( componentLookup.lookupFactory(name) ) {
        componentName = name;
        break;
      }
    }
    return componentName;
    
    
  }.property('type'),
  
  // temporary Workaround... replace with get-template function in device renderer
  //http://stackoverflow.com/questions/11169595/check-for-a-value-equals-to-in-ember-handlebar-if-block-helper#11177435
  isSlider: function() {
    return this.get('type').contains('/derived/percent');
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
