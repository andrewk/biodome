var ioLib = require('socket.io')
  , lo = require('lodash')

var SocketServer = function(app) {
  var self = this;
  self.io = ioLib.listen(app.server());
  
  self.io.sockets.on('connection', function(socket) {

    // broadcast sensor readings
    app.on('sensor update', function (data) {
      socket.emit('sensor update', data);
    });
  });
}

module.exports = SocketServer;
