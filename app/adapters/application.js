import DS from 'ember-data';

//export default DS.FixtureAdapter.extend();
export default DS.RESTAdapter.extend({
  namespace: 'api',
  //host: 'http://localhost:5000'
});