var fs = require('fs')
  , log = require('./log')
  , WebSocketServer = require('ws').Server
  , messageMediator = require('./message-interpreter').factory;

var config = {
  ssl: (process.env.SSL === 'true'),
  port: process.env.PORT,
  ssl_key: process.env.SSL_KEY,
  ssl_cert: process.env.SSL_CERT,
};

function Server(app)
{
  var self = this;
  this.messageProcessor = null;

  if (config.ssl) {
    this.http = require('https').createServer(
      { 
        key: fs.readFileSync(config.ssl_key), 
        cert: fs.readFileSync(config.ssl_cert)
      },
      this.processRequest
    ).listen(config.port);
  } else {
    this.http = require('http').createServer(this.processRequest).listen(config.port);
  }

  this.socket = new WebSocketServer({ server: this.http });
  this.socket.on('connection', function(connection) {
    log.info('socket connection from ' + connection.id); 

    connection.on('message', function(message) {
      var msgMeta = sefl.messageHandler.validateMessage(msg, app);

      if (msgMeta.valid) {
        // TODO log valid message and client
        self.messageHandler.sendMessageToApp(message, app);
      } else {
        // TODO log invalid message received, tell client
        connection.message('error:' + msgMeta.error);
      }
    });
  });
}

Server.prototype.messageHandler = function()
{
  this.msgHandler = this.msgHandler ||  messageMediator();
  return this.msgHandler;
}

Server.prototype.processRequest = function(req, res)
{
  req.writeHead(200);
  req.end('BLARGH!');
}

Server.prototype.close = function(callback)
{
  this.http.close(callback);
}


module.exports = Server;
module.exports.factory = function(app) {
  return new Server(app);
}

