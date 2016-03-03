import Ember from 'ember';

export default Ember.Controller.extend({
//center: {lat: 48.2628, lng: 11.6685},
  center: {lat: 80.5, lng: -84},
  zoom: 6, 


  actions: {
    updateLocation(r, e) {
      let location = e.target.getLatLng();
      r.set('location', location);
      //Ember.setProperties(r, {'location': {'lat': location.lat, 'lng': location.lng}});
      r.save();
    },

    // http://discuss.emberjs.com/t/how-to-update-item-without-using-save-button-option/8529/4
    update: function(/*c*/){
        console.log("update on map controller");
        //c.save();
    }
  }
});