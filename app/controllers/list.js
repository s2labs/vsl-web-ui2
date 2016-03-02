import Ember from 'ember';

export default Ember.Controller.extend({

  saveModel: function(){
      var model = this.get('model');
      // Avoid un-needed `.save()`s if user clicks Submit w/o typing anything
      if (model.get('hasDirtyAttributes')) {
          model.save().then( function(){
              // handle success
          }, function( error ){
              // handle failure
          });
      }
  },

  actions: {
    // http://discuss.emberjs.com/t/how-to-update-item-without-using-save-button-option/8529/4
    update: function(c){
        c.save();
    }
  }
});