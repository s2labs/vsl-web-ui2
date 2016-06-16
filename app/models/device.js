import Ember from 'ember';
import DS from 'ember-data';
import Dobject from 'web-ui2/models/dobject';

var Device = Dobject.extend({
  position: DS.belongsTo('position'),
  type: DS.attr(''),
  
  icon:  Ember.computed('type', function() {
    var type = this.get('type');
    if ( type ) {
      //https://github.com/coryasilva/Leaflet.ExtraMarkers#properties
      var options = {
        markerColor: 'white',
        shape: 'circle',
        //innerHTML: '<img src="img/fts_shutter.png" width="32" />'
      };
      if ( type.includes('gahu/blind') ) {
        options = {
          markerColor: 'cyan',
          shape: 'square',
          innerHTML: '<img src="img/fts_shutter.png" width="32" />'
        };
      }
      
      return new L.ExtraMarkers.icon(options);
    }
    else {
      return new L.Icon.Default();
    }
  })
});

export default Device;