var fs = require('fs')
  , os = require('os')
  , util = require('util')
  , log = require('./log')
  , WebSocketServer = require('ws').Server
  , messageInterpreter = require('./message-interpreter').factory;

var config = {
  ssl: (process.env.SSL === 'true'),
  port: process.env.PORT,
  ssl_key: process.env.SSL_KEY,
  ssl_cert: process.env.SSL_CERT,
}

var ServerClass = (config.ssl) ? require('https').Server : require('http').Server;

function Server(app) {
  this.app = app;
  ServerClass.call(this);
  this.socketServer = new WebSocketServer({ server: this });

  this.on('request', this.requestHandler);
  this.socketServer.on('connection', this.socketConnection);
};

util.inherits(Server, ServerClass);

Server.prototype.socketConnection = function(connection)
{
  var self = this;
  log.info('socket connection from ' + connection.id);

  connection.on('message', function(message) {
    var msgMeta = self.messageHandler.validateMessage(msg, app);

    if (msgMeta.valid) {
      // TODO log valid message and client
      self.messageHandler.sendMessageToApp(message, app);
    } else {
      // TODO log invalid message received, tell client
      connection.message('error:' + msgMeta.error);
    }
  });
}

Server.prototype.messageHandler = function()
{
  this.msgHandler = this.msgHandler ||  messageInterpreter();
  return this.msgHandler;
}

Server.prototype.status = function() {
  return {
    'uptime' : os.uptime(),
    'load' : os.loadavg(),
    'freememory' : os.freemem()
  };
};

Server.prototype.requestHandler = function(req, res)
{
  switch (req.url) {
    case '/status':
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(200);
      res.end(JSON.stringify(this.status()));
    break;

    default:
      res.writeHead(404);
      res.end('BLARGH!');
  }
}

module.exports = Server;
module.exports.factory = function(app) {
  return new Server(app);
}

