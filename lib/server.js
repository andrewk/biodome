var util = require('util'),
  http = require('http'),
  https = require('https'),
  ws = require('ws'),
  Rx = require('rx');

function getHttpServer(conf) {
  if (conf.ssl) {
    return new https.Server(conf);
  } else {
    return new http.Server();
  }
};

function Server(config, requestHandler, socketConnectionHandler) {
  this.http = getHttpServer(config);
  this.http.on('request', requestHandler);
  this.http.listen(config.port, () => {
    this.ws = new ws.Server({'server': this.http});
    this.ws.on('connection', socketConnectionHandler)
  });
};

Server.prototype.broadcastToSockets = function(message) {
  this.ws.clients.forEach(client => client.send(message));
};

Server.prototype.close = function() {
  this.http.close();
};

module.exports = Server;
module.exports.new = function(config, requestHandler, socketConnectionHandler) {
  return new Server(config, requestHandler, socketConnectionHandler);
};

