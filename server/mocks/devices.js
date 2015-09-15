module.exports = function(app) {
  var express = require('express');
  var devicesRouter = express.Router();
  var request = require('request');
  var xml2js = require('xml2js');
  var parser = new xml2js.Parser();

  function ds2os_request(params, callback) {
    var url = 'http://localhost/ds2os/?'+params;
    console.dir(url);
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        parser.parseString(body, function (err, result) {
          callback(Boolean(result['message']['error']), result['message']['result']);
        });
      } else {
        console.dir("unexpected result from ds2os xml servlet:\n" + body);
      }
    });
  }

  devicesRouter.get('/', function(req, res) {
    ds2os_request('op=get&address=/agent_andi1/geoSearch/locationOf/*',
      function (err, result) {
        var devices = result[0].trim().split("\n");
        var out = { 'devices': [] }, line;

        for ( var i in devices) {
          // TODO: does this also work with 2D coordinates, or do we have to add a .trim() to the following line?
          line = devices[i].split(" ", 4);

          out['devices'].push({
            'id': line.shift(), // shift pops first element from list
            'location': line.map(parseFloat)    // rest of the line are coordinates, convert to float
          });
        }
        res.send(out);
      }
    );
  });

  devicesRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  devicesRouter.get('/:path', function(req, res) {
    ds2os_request('op=get&address=/agent_andi1/' + req.params.path + '/', function (err, result) {
      //console.dir(result);
      res.send({
        'devices': result
      });
    });
  });

  devicesRouter.put('/:id', function(req, res) {
    res.send({
      'devices': {
        id: req.params.id
      }
    });
  });

  devicesRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/devices', devicesRouter);
};
