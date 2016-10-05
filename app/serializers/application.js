import DS from 'ember-data';


// done: collsion by Attribut 'type' -> entweder RESTSerializer verwenden, oder attribut type in types umbenenen 
// -> heißt im KA jetzt types

// https://emberigniter.com/fit-any-backend-into-ember-custom-adapters-serializers/

export default DS.JSONSerializer.extend({
  // KA -> client
  normalizeResponse: function(store, primaryModelClass, payload, id, requestType) {
    payload.id = id;

    if (payload.children) {
      var children = Object.keys(payload.children);
      payload.children = children.map(function(a){ return id + '/' + a; });
    }

    //delete payload.data.attributes.cost;

    return this._super(store, primaryModelClass, payload, id, requestType);
  },
  
  // KA (typeSearch) -> client
  normalizeQueryResponse: function(store, primaryModelClass, payload, id, requestType) {
    if (payload.value) {
      var result = payload.value.split('//');
      payload = new Array(result.length);
      for ( var key in result ) {
          payload[key] = {
            'id': key, 
            //'type' : 'deviceref',
            'device': result[key]
          };
      }
    }

    return this._super(store, primaryModelClass, payload, id, requestType);
  },
  
  // client -> KA
  serialize: function(snapshot /*, options*/) {
    var value = snapshot.attr('value');
    
    if ( typeof(value) === "boolean" ) {
      value = +value; // converts false to 0 or true to 1
    }

    return {
      'value': value
    };
  }
});
