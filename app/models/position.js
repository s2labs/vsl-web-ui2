import DS from 'ember-data';

var Location = DS.Model.extend({
  //geometry: DS.attr(''),
  location: DS.attr('coordinate'), // [76.7907, -93.2402] 
  device: DS.belongsTo('device'),
  
  /*
  latLng: function() {

    l = this.get('location');
    return l; //L.latLng(l[0], l[1]);
  }.property('location')
  */
});

/*
Device.reopenClass({
    FIXTURES: [
        {
           id: 1,
           name: 'lamp 1',
           location: L.latLng(70.7907, -92.2302),
         },
         {
           id: 2,
           name: 'dimmable lamp 2',
           location: L.latLng(76.7907, -93.2402),
         },
         {
           id: 3,
           name: 'colored lamp 3',
           location: L.latLng(74.7907, -92.2302),
         }
    ]
});
*/

export default Location;