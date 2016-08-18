import Ember from 'ember';

export default Ember.Controller.extend({
//center: {lat: 48.2628, lng: 11.6685},
  center: {lat: 80, lng: -69},
  zoom: 6, 

  actions: {
    updatePosition(r, e) {
      let point = e.target.getLatLng();
      r.set('center', point);
      r.save();
    }
  }
});