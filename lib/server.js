var fs = require('fs')
  , os = require('os')
  , util = require('util')
  , log = require('./log')
  , WebSocketServer = require('ws').Server

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

Server.prototype.broadcast = function(message) {
  for(var i in this.socketServer.clients) {
		this.socketServer.clients[i].send(message);
  }
}

Server.prototype.createSocketServer = function(callback) {
  var self = this;
  this.listen(process.env.PORT, function() {
    self.socketServer = new WebSocketServer({ server: self })
    self.socketServer.on('connection', self.socketConnection.bind(self));
    if ('function' === typeof callback) callback();
  });
};

Server.prototype.socketConnection = function(client) {
  var self = this;
  client.on('message', function(message) {
    if (!message) {
      return client.send(
        JSON.stringify({'type': 'error', 'message': 'Invalid server message'})
      );
    }
    
    try {
      self.app.executeInstruction(JSON.parse(message)).then(function(result) {
        client.send(JSON.stringify({'type' : 'success', 'data' : result }));
      }).catch(function(error) {
        client.send(JSON.stringify({'type' : 'error', 'message' : error.message }));
      });
    } catch(error) {
      client.send(JSON.stringify({'type' : 'error', 'message' : error.message }));
    }
  });
};

// TODO more useful data, connection count etc
Server.prototype.status = function() {
  return {
    'uptime' : (process.uptime() / 60).toString() + ' minutes',
    'load' : os.loadavg(),
    'freememory' : os.freemem() / 1024
  };
};

Server.prototype.requestHandler = function(req, res) {
  switch (req.url) {
    case '/status':
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(200);
      res.end(JSON.stringify(this.status()));
    break;

    default:
      res.writeHead(401);
      res.end('BLARGH!');
  }
};

module.exports = Server;
module.exports.new = function(app) {
  return new Server(app);
};

