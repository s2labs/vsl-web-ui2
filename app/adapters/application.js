import Ember from 'ember';
import DS from 'ember-data';
import config from '../config/environment';

/* 
* DOKU: https://guides.emberjs.com/v2.8.0/models/customizing-adapters/
*/

// see also https://github.com/emberjs/data/issues/4563#issuecomment-251860488
Ember.$.ajaxSetup({
  xhrFields: {
    withCredentials: true
  }
});



// Der DS2OS KA benutzt aktuell PUT und nicht PATCH -> Deswegen RESTAdapter und nicht JSONAPIAdapter
export default DS.RESTAdapter.extend({
  namespace: '',
  host: config.kaURL,
  
  
  pathForType: function(type) {
    if ( type === 'position' ) {
      return 'vsl/agent2/geoservice/positionOf';
    }
    return 'vsl'; // all other types are in the same namespace
  },
  
  // https://github.com/emberjs/data/blob/v2.7.0/addon/-private/adapters/build-url-mixin.js#L33
  // Normalerweise wird die id durch encode URI component gejagt, dabei werden die slashes in der id durch %xxx ersetzt/escaped
  // Da wir das nicht wollen muessen wir die Funktion ueberschreiben:
  buildURL: function(modelName, id, snapshot, requestType /*, query*/) {
    var url = [];
    var host = this.get('host');
    var prefix = this.urlPrefix();
    var path;

    path = this.pathForType(modelName);
    if (path) { url.push(path); }

    if (id) { 
      //else return ''; TODO return empty response for id's which are not beginning with an /
      
      if ( requestType === 'updateRecord') {
        if ( modelName !== 'position' && isMAPE(snapshot.attr('types')) ) {
          id =  id + '/desired';
        }
      }
      if ( id.charAt(0) === '/') { id = id.substring(1); }
      
      url.push(id);  // dont encode URI compontent
    } else if (requestType === 'findAll') {
      url.push('*');
    }
    
    if (prefix) { url.unshift(prefix); }

    url = url.join('/');
    if (!host && url && url.charAt(0) !== '/') {
      url = '/' + url;
    }
    
    if ( modelName !== 'position' && requestType.includes('find')) {
      // to reduce overhead only load value and not complete object when reload is triggered via web-socket message
      // das reload true steht in options von store.fetch() und wird bis zu https://github.com/emberjs/data/blob/3f4ae526a086dcb42c9bb0f60758c9769ea41feb/addon/-private/system/snapshot.js#L17 durchgereicht, da gehts verloren. Aber es gibt die adapterOptions... :-)
      
      // da {"value":"0","version":-1,"restrictions":{},"access":"","types":[]} und nicht {"value":"0"} geht da irgendwas kapput... 
      //if ( !snapshot.adapterOptions ) {
        url = url + '?depth=1&scope=complete';
      /*
      } else if ( snapshot.adapterOptions.scope != 'value' ) {
        console.log('with adapterOptions: ' + snapshot.adapterOptions);
        url = url + '?depth=0&scope=' + snapshot.adapterOptions.scope;
      }
      else {
        //scope is value -> default -> we do not have to append anything to the url
      }
      console.log(url);
      */ 
    }
    return url;
  },
  query: function(store, type, query) {
      var url = this.buildURL(type.modelName, null, null, 'query', query);
      
      for (var key in query) {
        // TODO: replace /agent2/ with /search/ when implemented in KA
        url += '/agent2/' + key + query[key];
      }
      
      return this.ajax(url, 'GET');
  },
  
  // from http://stackoverflow.com/a/32864639
  // will be deprecated in future releases, see https://github.com/emberjs/data/issues/4563
  /*ajax(url, method, hash) {
    hash = hash || {};
    hash.crossDomain = true;
    hash.xhrFields = {
      withCredentials: true
    };
    return this._super(url, method, hash);
  }*/
}); 


function isMAPE(types) {
    for (var type of types) {
      if ( type.includes('/mape') ) {
        return true;
      }
    }
}