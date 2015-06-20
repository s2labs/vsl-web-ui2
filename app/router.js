import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('devices', { path: '/'});
  this.resource('test', { path: '/test'});
});

export default Router;
