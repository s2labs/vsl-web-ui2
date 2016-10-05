import DS from 'ember-data';

export default DS.JSONSerializer.extend({
  // KA -> client
  normalizeResponse: function(store, primaryModelClass, payload, id, requestType) {

    if (payload.children) {
      var children = payload.children;
      payload = [];
      for ( var key in children ) {
          payload.push({
            'id': key, //.replace(/_/g, "/"),
            'center': parse_point(children[key]),
            // Zum übrmitteln es Ergebnis werden VSL nodes benutzt. 
            // Der Name eines Nodes darf keine / enthalten, damit es beim Pfad keine Verwechslungen gibt.
            // Deswegen escaped der Geoservice die Einträge, in dem er / durch _ ersetzt.
            // Das müssen wir hier wieder rückgängig machen:
            'device': key.replace(/_/g, "/")
          });
      }
    }

    return this._super(store, primaryModelClass, payload, id, requestType);
  },
  // client -> KA
  serialize: function(snapshot /*, options*/) {
    var json = {
      'value': snapshot.attr('center').join(" ")
    };

    return json;
  }
});

function parse_point(node) {
  return node['value'].split(" ", 3).map(parseFloat);
}