var util = require('util')
  , WebSocketServer = require('ws').Server
  , commandAction = require('./server-actions/command')
  , statusAction = require('./server-actions/status')
  ;

var ssl = (process.env.SSL === 'true');
var config = {
  key: process.env.SSL_KEY,
  cert: process.env.SSL_CERT,
}

var ServerClass = ssl ? require('https').Server : require('http').Server;

function Server(app) {
  this.app = app;

  if (ssl) {
    ServerClass.call(this, config);
  } else {
    ServerClass.call(this);
  }

  this.on('request', this.requestHandler);
  this.socketServer = null;
};

util.inherits(Server, ServerClass);

Server.prototype.requestHandler = function(req, res) {
  switch (req.url) {
    case '/status':
      return statusAction(this.app, req, res);
    break;

    case '/command':
      return commandAction(this.app, req, res);
    break;

    default:
      // TODO 404
  }
};

Server.prototype.broadcast = function(message) {
  for(var i in this.socketServer.clients) {
    this.socketServer.clients[i].send(message);
  }
}

Server.prototype.createSocketServer = function(callback) {
  this.listen(process.env.PORT, function() {
    this.socketServer = new WebSocketServer({ server: this })
    this.socketServer.on('connection', this.socketConnection.bind(this));
    if ('function' === typeof callback) callback();
  }.bind(this));
};

Server.prototype.socketConnection = function(client) {
  client.on('message', function(message) {
    if (!message) {
      return client.send(
        JSON.stringify({'type': 'error', 'message': 'Invalid server message'})
      );
    }
  }.bind(this));
};

module.exports = Server;
module.exports.new = function(app) {
  return new Server(app);
};

