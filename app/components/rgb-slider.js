import Ember from 'ember';

export default Ember.Component.extend({
  colorStyle: Ember.computed('color.red', 'color.green', 'color.blue', function() {
    return Ember.String.htmlSafe("border: 1px solid #333; background: rgb(" + this.get('color.red') + "," + this.get('color.green') + "," + this.get('color.blue') + ")");
  })

});