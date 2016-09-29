module.exports = function(app) {
  var express = require('express')
    , positionsRouter = express.Router()
    , VSL = require(__dirname + '/../vsl.js')
    , vsl = new VSL(2);
  
  function parse_point(node) {
    return node['value'].split(" ", 3).map(parseFloat);
  }

  positionsRouter.get('/', function(req, res) {
    vsl.get('/agent2/geoservice/locationOf/*',
      function (err, result) {
        res.send(result);
        return;
      }
    );
  });

  positionsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  positionsRouter.get('/:id', function(req, res) {
    var id = req.params.id;
    vsl.get_raw('/agent2/geoservice/locationOf/' + id, function (err, result) {
      res.send(result);
    });
  });

  positionsRouter.put('/:id', function(req, res) {
    var id = req.params.id;
    console.dir(req.body['position']['location']);
    
    vsl.set_raw('/agent2/geoservice/locationOf/' + id, 
      { 'value': req.body['position']['center'].join(" ") },
      function () { res.status(204).end(); }
    );
  });



  app.use('/api/positions',  positionsRouter);
};
