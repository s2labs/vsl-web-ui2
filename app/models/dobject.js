import DS from 'ember-data';

export default DS.Model.extend({
  value: DS.attr('number'),
  type: DS.attr('string'),
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
  
  // TOOD sollte man das ggf. debouncen, vgl. http://discuss.emberjs.com/t/how-to-update-item-without-using-save-button-option/8529/4
  // TODO hat dieser Code überhaupt was im Model zu suchen?
  watchValue: function() {
    console.log('value changed');
    if ( this.get('hasDirtyAttributes') ) {
      this.save();
    }
  }.observes('value')
});
