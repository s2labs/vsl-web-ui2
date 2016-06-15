import DS from 'ember-data';

export default DS.Model.extend({
  value: DS.attr('number'),
  type: DS.attr(),
  // restrictions: DS.attr(),
  //min: DS.attr('number'),
  //max: DS.attr('number'),
  //timestamp: DS.attr('number'),
  //version: DS.attr('number'),
  //access: DS.attr('string'),
  //children: DS.attr()
  children: DS.hasMany('dobject', { inverse: 'parent' }),
  parent: DS.belongsTo('dobject', { inverse: 'children' }),
  
  name: function() {
    var id = this.get('id');
    return id.substring(id.lastIndexOf('_')+1);
  }.property('id'),
  
  
  componentName: function() {
    // TODO check if type is string or list and proably change api layers
    // TODO iterate througt types and check if there is an coresponding component
    // try 
    /* TODO 
       * https://github.com/emberjs/ember.js/blob/f6bad3dad476f952d79c3386bf9f7be12b075380/packages/ember-routing/lib/system/route.js#L2180
       * https://github.com/emberjs/ember.js/search?p=2&q=lookup+component&utf8=✓
    
    var componentName = "basic-composed";
    foreach this.get('type') as type
    {
       var name = type.substring(1).replace('/','-');
      if ( Ember.ComponentLookup(componentName) )
      {
        componentName = name;
        break;
      }
    }
    return componentName
    
    */
    
    
    return this.get('type').includes('/derived/percent') ? "basic-number" : "derived-boolean";
    //
  }.property('type'),
  
  // temporary Workaround... replace with get-template function in device renderer
  //http://stackoverflow.com/questions/11169595/check-for-a-value-equals-to-in-ember-handlebar-if-block-helper#11177435
  isSlider: function() {
    return this.get('type').includes('/derived/percent');
  }.property('type'),
  
  
  // TOOD sollte man das ggf. debouncen, vgl. http://discuss.emberjs.com/t/how-to-update-item-without-using-save-button-option/8529/4
  // TODO hat dieser Code überhaupt was im Model zu suchen?
  watchValue: function() {
    console.log('value changed');
    if ( this.get('hasDirtyAttributes') ) {
      this.save();
    }
  }.observes('value')
});
