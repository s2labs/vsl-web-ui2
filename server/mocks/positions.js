module.exports = function(app) {
  var express = require('express')
    , positionsRouter = express.Router()
    , VSL = require(__dirname + '/../vsl.js')
    , vsl = new VSL(2, '/Users/andi/Projekte/MA/git/vsl/java6-ka/system.p12', '/Users/andi/Projekte/MA/git/vsl/java6-ka/ca.crt');
  
  function parse_location(node) {
    return node['value'].split(" ", 3).map(parseFloat);
  }

  positionsRouter.get('/', function(req, res) {
    vsl.get('agent2/geoservice/locationOf/*',
      function (err, result) {
        var out = { 'positions': [] };

        for ( var key in result['children']) {
          out['positions'].push({
            'id': key,
            'location': parse_location(result['children'][key]),
            'device': key  
          });
        }
        res.send(out);
      }
    );
  });

  positionsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  positionsRouter.get('/:id', function(req, res) {
    var id = req.params.id;
    vsl.get('agent2/geoservice/locationOf/' + id, function (err, result) {
      res.send({
        'positions': [ { 'id' : id, 'location': parse_location(result) }]
      });
    });
  });

  positionsRouter.put('/:id', function(req, res) {
    var id = req.params.id;
    console.dir(req.body['position']['location']);
    
    vsl.set('agent2/geoservice/locationOf/' + id, 
      { 'value': req.body['position']['location'].join(" ") },
      function () { res.status(204).end(); }
    );
  });



  app.use('/api/positions',  positionsRouter);
};
