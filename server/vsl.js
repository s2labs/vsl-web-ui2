
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
  if ( keyPath == null ) keyPath='../certs/system.p12';
  if ( caPath  == null ) caPath='../certs/ca.crt';
  
  //this.app = app;
  
  this.keyFile = fs.readFileSync(path.resolve(__dirname, keyPath));
  this.caFile = fs.readFileSync(path.resolve(__dirname, caPath));

  if ( ka_num == undefined ) ka_num = 1;
  this.port = '808' + ka_num;
};


VSL.prototype.request = function (method, params, callback, body) {
  var path = params;
  // ensure path is starting with a slash
  if (path[0] != "/") {
    path =  "/" + path;
  }
  
  var options = {
    url: 'https://localhost:' + this.port + path,
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
  console.log("  " + method + " " + options.url);
  
  // see https://github.com/request/request/blob/master/README.md for documentation
  http_request(options, function (error, response, body) {
    if (!error && response.statusCode == 200 ) {
      callback(error, JSON.parse(body));
    } else if (!error && response.statusCode == 204 ) {
      callback(error, "");
    } else {
      console.log("  unexpected response from KA:");
      if ( error ) console.log("    " + body);
      if ( body ) console.log("    " + body);
      console.log("  request was " + method + " " + options.url);
      callback(error, body);
    }
  });
};

VSL.prototype.get = function (params, callback) {
  // unescape slashes: replace all _ with /
  return this.request('GET', params.replace(/_/g, "/"), callback)
};
VSL.prototype.get_raw = function (params, callback) {
  return this.request('GET', params, callback)
};

VSL.prototype.set = function (params, body, callback) {
  // unescape slashes: replace all _ with /
  return this.request('PUT', params.replace(/_/g, "/"), callback, body);
};
VSL.prototype.set_raw = function (params, body, callback) {
  return this.request('PUT', params, callback, body);
};

