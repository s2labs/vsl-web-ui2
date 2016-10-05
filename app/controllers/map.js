import Ember from 'ember';

export default Ember.Controller.extend({
//center: {lat: 48.2628, lng: 11.6685},
  center: {lat: 80, lng: -69},
  zoom: 6, 

  actions: {
    updatePosition(r, e) {
      let point = e.target.getLatLng();
      r.set('center', point);
      // do not save to KA until a device is assigned
      if ( this.get('device') ) {
      //if ( !(this.get('id') <= 0) ) {
        r.save();
      }
    },
    addPosition() {
      this.get('store').push({ data: [{
        id: i--,
        type: 'position',
        attributes: {
          center: this.get('center')
        },
        relationships: {}
      }] });
    }
  }
});

var i = -1;