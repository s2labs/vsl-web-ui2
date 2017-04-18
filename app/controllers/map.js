import Ember from 'ember';

export default Ember.Controller.extend({
//center: {lat: 48.2628, lng: 11.6685},
  center: {lat: 80, lng: -69},
  zoom: 6, 
  
  adapter: null,
  
  devicesWithoutLocation: [],
  
  init: function() {
    //this.set('adapter', this.store.adapterFor('application'));
    
    var foo = this.store.adapterFor('application').query('', '', {'geoservice/devicesWithoutLocation' : ''});
    console.log(foo);
  },
  
  openSelect: function () {
    console.log('openSelect');
  },
  
  loadDevicesWithoutLocation: function () {
  
    var _self = this;
    
    console.log('foo');
    var adapter = this.get('adapter');
    console.log(adapter)
    //var r = adapter.query(null, null, {'geoservice/devicesWithoutLocation' : ''});
    //console.log(r);
    
    return new Ember.RSVP.Promise(function(resolve) {

    //    var adapter = _self.get('store').adapterFor('application');
    //console.log(adapter)
    //var r = adapter.query(null, null, {'geoservice/devicesWithoutLocation' : ''});
    //console.log(r);
          
      var dataFromServer = Ember.A([
        { id: 1, name: 'socket1' },
        { id: 2, name: 'socket2' },
        { id: 3, name: 'socket3' },
        { id: 4, name: 'socket4' },
        { id: 5, name: 'socket5' },
      ]);

      resolve(dataFromServer);
    
      //var devices =  this.get('store').query('deviceref', {'geoservice/devicesWithoutLocation' : ''});
    
      //resolve(_self.get('store').query('deviceref', {'geoservice/devicesWithoutLocation' : ''}));
    });
  },

  deviceLabelCallback: function (item) {
    return item.get('name');
  },

  labelCallback: function (item) {
    // using ember data, this might be "item.get('name')"
    console.log(item);
    return item.name;
  },


  actions: {
    updatePosition(r, e) {
      let point = e.target.getLatLng();
      console.log(r.get('center') + " " + point);
      point['alt'] = 3; // TODO use current floor value when floor selector was implemented
      r.set('center', point);
      // do not save to KA until a device is assigned
      //if ( this.get('device') ) {
      //if ( !(this.get('id') <= 0) ) {
        r.save();
      //}
    },
    addPosition() {
      // TODO: Open dialog to select device id
      
      this.get('store').push({ data: [{
        id: i--,
        type: 'position',
        attributes: {
          center: this.get('center')
        },
        relationships: {}
      }] });
      
    },
    setDevice(r) {
      console.log('set device' + r);
    }
  }
});

var i = -1;