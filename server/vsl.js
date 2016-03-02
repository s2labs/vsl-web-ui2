
//var bodyParser = require('body-parser');
var http_request = require('request');
var fs = require('fs');
var path = require('path');

module.exports = VSL;


/*  TODO
  // from http://stackoverflow.com/questions/10888610/ignore-invalid-self-signed-ssl-certificate-in-node-js-with-https-request
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  
    // parse application/json
    app.use(bodyParser.json())
*/    


function VSL(ka_num, keyPath, caPath) {
  
  //this.app = app;
  
  this.keyFile = fs.readFileSync(path.resolve(__dirname, keyPath));
  this.caFile = fs.readFileSync(path.resolve(__dirname, caPath));

  if ( ka_num == undefined ) ka_num = 8;
  this.port = '808' + ka_num;
};


VSL.prototype.request = function (method, params, method_callback, body) {
  var options = {
    url: 'https://localhost:' + this.port +'/'+params,
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    agentOptions: {
      ca: this.caFile,
      pfx: this.keyFile,
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
  
  // see https://github.com/request/request/blob/master/README.md for documentation
  http_request(options, callback);
}

VSL.prototype.get = function (params, callback) {
  return this.request('GET', params, callback)
}
      
VSL.prototype.set = function (params, body, callback) {
  return this.request('PUT', params, callback, body);
}

