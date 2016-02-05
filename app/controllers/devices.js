import Ember from 'ember';

export default Ember.Controller.extend({
//center: {lat: 48.2628, lng: 11.6685},
  center: {lat: 78, lng: -90},
  zoom: 4, 

  actions: {
    updateLocation(r, e) {
      let location = e.target.getLatLng();
      r.set('location', location);
      r.save();
    }
  }
});