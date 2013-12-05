var ioLib = require('socket.io')
  , lo = require('lodash')

var SocketServer = function(app) {
  var self = this;
  self.io = ioLib.listen(app.server(), {'log level':1});
  
  self.io.sockets.on('connection', function(socket) {

    // broadcast sensor readings
    app.on('sensor update', function (data) {
      socket.emit('sensor update', data);
    });

    // broadcast device changes
    app.on('device update', function (data) {
      socket.emit('device update', data);
    });
  });
}

module.exports = SocketServer;
