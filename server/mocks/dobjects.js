module.exports = function(app) {
  var express = require('express')
    , dobjectsRouter = express.Router()
    , VSL = require(__dirname + '/../vsl.js')
    , vsl = new VSL(2);

  dobjectsRouter.get('/:id', function(req, res) {
    var id = req.params.id;
    

    
    vsl.get(id.replace("_", "/"), function (err, result) {

      var out = { 'dobjects': [] };
      var device = {'id' : id};
      out['dobjects'].push(device);
      
      for ( var key in result) {
        if ( key != 'children' ) {
          device[key] = result[key];
        }
      }
      
      if (result['children']) {
        device['children'] = [];
        for ( var name in result['children']) {
          device['children'].push(id + '_' + name);
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
    vsl.set(id + "/desired", 
      { 'value': req.body['dobject']['value'] }, function (err, result) { 
        res.status(204).end(); 
    });
  });

  app.use('/api/dobjects', dobjectsRouter);
};
