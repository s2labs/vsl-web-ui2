import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL,
  kaURL: config.kaURL
});

Router.map(function() {
  this.route('map', { path: '/'});
  this.route('list', { path: '/list'});
  this.route('test', { path: '/test'});
});

export default Router;
