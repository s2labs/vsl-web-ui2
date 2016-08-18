module.exports = function(app) {
  var express = require('express')
    , bodyParser = require('body-parser')
    , devicesRouter = express.Router()
    , VSL = require(__dirname + '/../vsl.js')
    , vsl = new VSL(2);
  
  
  // from http://stackoverflow.com/questions/10888610/ignore-invalid-self-signed-ssl-certificate-in-node-js-with-https-request
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  // parse application/json
  app.use(bodyParser.json())
//*/
  
  devicesRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  devicesRouter.get('/:id', function(req, res) {
    var id = req.params.id;
    
    
    vsl.get(id, function (err, result) {
      // helper function: flatten node tree
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
      
      // actual implementation of get method:
      var out = { 'devices': [], 'dobjects': [] };
      var device = {'id' : id};
      out['devices'].push(device);
      
      for ( var key in result) {
        if ( key != 'children' ) {
          device[key] = result[key];
        }
      }
      
      // if node contains children
      if (result && result['children']) {
        device['children'] = [];
        for ( var name in result['children']) {
          device['children'].push(id + '_' + name);
          serialize_children(id + '_' + name, result['children'][name]);
        }
      }
    
      res.send(out);
    });
    
  });

  devicesRouter.put('/:id', function(req, res) {
    var id = req.params.id;
    console.dir(req.body['device']);
    
    vsl.set(id, 
       { 'value': req.body['device'] },
       function () { res.status(204).end(); }
    );
  });

  devicesRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });


  app.use('/api/devices', devicesRouter);
  //app.use('/api/dobjects', devicesRouter);
};
