var fs = require('fs')
, os = require('os')
, util = require('util')
, log = require('./log')
, http = require('http')
, WebSocketServer = require('ws').Server

var ssl = (process.env.SSL === 'true');
var config = {
  key: process.env.SSL_KEY,
  cert: process.env.SSL_CERT,
}

function errorResponse(httpCode, response) {
  response.writeHead(httpCode);
  response.end(http.STATUS_CODES[httpCode]);
}

var ServerClass = ssl ? require('https').Server : http.Server;

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
      return this.statusAction(req, res);
    break;

    case '/command':
      return this.commandAction(req, res);
    break;

    default:
      return errorResponse(404, res);
  }
};

//
// Return system status
//
Server.prototype.statusAction = function(request, response) {
  response.setHeader('Content-Type', 'application/json');
  response.writeHead(200);
  response.end(JSON.stringify(this.status()));
};

//
// Validate and execute an app command
//
Server.prototype.commandAction = function(request, response) {
  if (request.method !== 'POST') {
    return errorResponse(405, response);
  }

  var body = '';
  request.setEncoding('utf8');
  request.on('data', function (chunk) {
    body += chunk;

    if (body.length > 1e6) {
      errorResponse(413, response);
      request.connection.destroy();
    }
  })

  // the end event tells you that you have entire body
  request.on('end', function () {
    try {
      this.app.executeInstruction(JSON.parse(body))
        .then(function(result) {
          response.writeHead(200, {
            'Content-type' : 'application/json' 
          });
          response.end(
            JSON.stringify({'data' : result })
          );
        }).catch(function(error) {
          response.writeHead(400);
          response.end(error.message);
        });
    } catch(error) {
      return errorResponse(417, response);
    }
  }.bind(this));
};

module.exports = Server;
module.exports.new = function(app) {
  return new Server(app);
};

