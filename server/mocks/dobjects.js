module.exports = function(app) {
  var express = require('express')
    , dobjectsRouter = express.Router()
    , VSL = require(__dirname + '/../vsl.js')
    , vsl = new VSL(2, '/Users/andi/Projekte/MA/git/vsl/java6-ka/system.p12', '/Users/andi/Projekte/MA/git/vsl/java6-ka/ca.crt');
 
 

  dobjectsRouter.get('/:id', function(req, res) {
    var id = req.params.id;
    vsl.get('agent2/gateway1/' + id, function (err, result) {

      var out = { 'dobjects': [] };
      var device = {'id' : id};
      out['dobjects'].push(device);
      
      for ( var key in result) {
        if ( key != 'children' ) {
          device[key] = result[key];
        }
      }
      // flatten node tree
      function serialize_children(id, attributes) {
        var item = {'id' : id};
        out['dobjects'].push(item);

        for ( var key in attributes ) {
          if ( key != 'children' ) {
            item[key] = attributes[key]
            //item['id'] = id + '_' + key;
          } 
        }
        if (attributes['children']) {
          item['children'] = [];
          for ( var name in attributes['children']) {
            item['children'].push(id + '_' + name);
            serialize_children(id + '_' + name, attributes['children'][name]);
          }
        }
      }
      
      if (result['children']) {
        device['children'] = [];
        for ( var name in result['children']) {
          device['children'].push(id + '_' + name);
          serialize_children(id + '_' + name, result['children'][name]);
        }
      }
    
      res.send(out);
    });
    
  });

  dobjectsRouter.put('/:id', function(req, res) {
    var id = req.params.id;
    console.dir(req.body['dobject']);
    
    // TODO das mit /desired anhaengen hinten funktioniert nur weil das WebUI bisher noch keine anderen Nodes als isOn bearbeitet.
    // das sollte eigentlich im Model oder Controller gemacht werden
    vsl.set('agent2/gateway1/' + id.replace("_", "/") + "/desired", 
      { 'value': req.body['dobject']['value'] }, function (err, result) { 
        res.status(204).end(); 
    });
  });

  app.use('/api/dobjects', dobjectsRouter);
};
