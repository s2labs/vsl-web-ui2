module.exports = function(app) {
  var express = require('express')
    , bodyParser = require('body-parser')
    , devicesRouter = express.Router()
    , request = require('request')
    , fs = require('fs')
    , path = require('path')
    , certFile = path.resolve(__dirname, '../ssl/system.p12')
    , caFile = path.resolve(__dirname, '../ssl/ca.crt');
  
  // from http://stackoverflow.com/questions/10888610/ignore-invalid-self-signed-ssl-certificate-in-node-js-with-https-request
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  // parse application/json
  app.use(bodyParser.json())


  // TODO: folgende Methode in einene Klasse auslagern, die ggf. request ueberlagert.
  // cool waeren aufrufe wie 
  // ds2os.ka.get('system/geoservice/locationOf/*', callback)
  // ds2os.ka.put('system/geoservice/locationOf/', body)

  // see https://github.com/request/request/blob/master/README.md for documentation
  function ds2os_request(method, params, method_callback, body) {
    var options = {
      url: 'https://localhost:8088/localKA/'+params,
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
  
  function parse_location(node) {
    return node['value'].split(" ", 3).map(parseFloat);
  }

  devicesRouter.get('/', function(req, res) {
    ds2os_request('GET', 'system/geoservice/locationOf/*',
      function (err, result) {
        var out = { 'devices': [] };

        for ( var key in result['children']) {
          out['devices'].push({
            'id': key,
            'location': parse_location(result['children'][key])  
          });
        }
        res.send(out);
      }
    );
  });

  devicesRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  devicesRouter.get('/:id', function(req, res) {
    var id = req.params.id;
    ds2os_request('GET', 'system/geoservice/locationOf/' + id, function (err, result) {
      res.send({
        'devices': [ { 'id' : id, 'location': parse_location(result) }]
      });
    });
  });

  devicesRouter.put('/:id', function(req, res) {
    var id = req.params.id;
    console.dir(req.body['device']['location']);
    
    var body = { 'value': req.body['device']['location'].join(" ") };
    
    ds2os_request('PUT', 'system/geoservice/locationOf/' + id, function (err, result) {
      res.status(204).end(); 
    }, body);
  });

  devicesRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });


  app.use('/api/devices', devicesRouter);
};
