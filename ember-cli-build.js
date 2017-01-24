/*jshint node:true*/
/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
    var app = new EmberApp(defaults, {
        // Any other options
        fingerprint: {
          exclude: [
            'images/layers-2x.png',
            'images/layers.png',
            'images/marker-icon-2x.png',
            'images/marker-icon.png',
            'images/marker-shadow.png',
            'images/marker-shadow@2x.png',
            'images/marker-default.png',
            'images/marker-default@2x.png'
          ]
        }
    });


// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

// see also https://guides.emberjs.com/v2.5.0/addons-and-dependencies/managing-dependencies/

    //app.import('bower_components/Leaflet.Grid/L.Grid.js')
    app.import('bower_components/leaflet.coordinates/dist/Leaflet.Coordinates-0.1.5.min.js');

    // TODO http://stackoverflow.com/a/29480973
    app.import('bower_components/leaflet.extra-markers/dist/js/leaflet.extra-markers.min.js');
    app.import('bower_components/leaflet.extra-markers/dist/css/leaflet.extra-markers.min.css');
    app.import('bower_components/leaflet.extra-markers/dist/img/markers_default.png', {destDir: 'img'});
    app.import('bower_components/leaflet.extra-markers/dist/img/markers_shadow.png', {destDir: 'img'});
    app.import('bower_components/leaflet.extra-markers/dist/img/markers_default@2x.png', {destDir: 'img'});
    app.import('bower_components/leaflet.extra-markers/dist/img/markers_shadow@2x.png', {destDir: 'img'});


    //app.import('bower_components/svg-injector/dist/svg-injector.min.js');

    app.import('bower_components/knx-uf-iconset/raw_480x480/fts_shutter.png', {destDir: 'img'});
    return app.toTree();
};
