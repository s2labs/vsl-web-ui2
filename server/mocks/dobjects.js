module.exports = function(app) {
  var express = require('express')
    , bodyParser = require('body-parser')
    , dobjectsRouter = express.Router()
    , request = require('request')
    , fs = require('fs')
    , path = require('path')
    , certFile = path.resolve(__dirname, '/Users/andi/Projekte/MA/git/vsl/java6-ka/system.p12')
    , caFile = path.resolve(__dirname, '/Users/andi/Projekte/MA/git/vsl/java6-ka/ca.crt');
  
  // from http://stackoverflow.com/questions/10888610/ignore-invalid-self-signed-ssl-certificate-in-node-js-with-https-request
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  // parse application/json
  app.use(bodyParser.json())


  // TODO: folgende Methode in einene Klasse auslagern, die ggf. request ueberlagert.
  // cool waeren aufrufe wie 
  // ds2os.ka.get('system/geoservice/locationOf/*', callback)
  // ds2os.ka.put('system/geoservice/locationOf/', body)

  // see https://github.com/request/request/blob/master/README.md for documentation
  function ds2os_request(method, params, method_callback, body, port) {
    if ( port == undefined ) port = 82;
    var options = {
      url: 'https://localhost:80' + port +'/'+params,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      agentOptions: {
        ca: fs.readFileSync(caFile),
        pfx: fs.readFileSync(certFile),
        passphrase: 'K3yst0r3'
      },
      body: JSON.stringify(body)
    };
    console.dir(options.url);
    
    function callback (error, response, body) {
      if (!error && response.statusCode == 200 ) {
        method_callback(error, JSON.parse(body));
      } else if (!error && response.statusCode == 204 ) {
        method_callback(error, "");
      } else {
        console.dir("unexpected result:");
        console.dir("  " + error);
      }
    }
    
    request(options, callback);
  }
  
  dobjectsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  dobjectsRouter.get('/:id', function(req, res) {
    var id = req.params.id;
    ds2os_request('GET', 'agent2/gateway1/' + id, function (err, result) {
    /*
      result['id'] = id;
      res.send({
        'dobjects': [ result ]
      });
      */
      var out = { 'dobjects': [], 'dobjects': [] };
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
    
    var body = { 'value': req.body['dobject']['value'] };
    
    
    
    ds2os_request('PUT', 'agent2/gateway1/' + id.replace("_", "/") + "/desired", function (err, result) {
      res.status(204).end(); 
    }, body);
  });

  dobjectsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });


  app.use('/api/dobjects', dobjectsRouter);
};
