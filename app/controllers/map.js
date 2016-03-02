import Ember from 'ember';

export default Ember.Controller.extend({
//center: {lat: 48.2628, lng: 11.6685},
  center: {lat: 80.5, lng: -84},
  zoom: 6, 


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
    updateLocation(r, e) {
      let location = e.target.getLatLng();
      r.set('location', location);
      //Ember.setProperties(r, {'location': {'lat': location.lat, 'lng': location.lng}});
      r.save();
    },
    modelChanged(){
        var debounced = Ember.run.debounce(this, this.saveModel, 2000); // 2 seconds
        this.set('debounced', debounced);
    },
    // http://discuss.emberjs.com/t/how-to-update-item-without-using-save-button-option/8529/4
    update: function(c){
        c.save();
    }
  }
});