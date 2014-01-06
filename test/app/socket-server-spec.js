var chai = require("chai")
  , sinon = require("sinon")
  , expect = chai.expect
  , io = require('socket.io-client')
  , app = require('../blueprints/app').make()
  , SocketServer = require('../../app/socket-server');

var options = {
  'transports': ['websocket'],
  'force new connection': true,
  'level' : 0
};

app.server().listen(app.conf.get('PORT'));
var server = new SocketServer(app)

describe('SocketServer', function() {
  describe('connection', function() {
    it('broadcasts sensor updates', function(done) {
      var client = io.connect(app.server().url, options)
        , doneCalled = false;
      client.on('sensor update', function(sensor) {
        expect(sensor.id).to.equal(app.sensors[0].id)
        if (!doneCalled) done();
        doneCalled = true;
      });

      client.on('connect', function() {
        app.sensors[0].update()
      });
    });

    it('broadcasts device changes', function(done) {
      var client = io.connect(app.server().url, options)
        , doneCalled = false;
      client.on('device update', function(device) {
        expect(device.id).to.equal(app.devices[0].id)
        if(!doneCalled) done();
        doneCalled = true;
      });

      client.on('connect', function() {
        app.devices[0].on()
      });

    });
  });
});
