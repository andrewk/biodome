var chai = require("chai")
  , sinon = require("sinon")
  , expect = chai.expect
  , io = require('socket.io-client')
  , app = require('../blueprints/app').make()
  , SocketServer = require('../../app/socket-server');

var options = {
  'transports': ['websocket'],
  'force new connection': true
};

describe('SocketServer', function() {
  describe('connection', function() {
    it('broadcasts sensor updates', function(done) {
      app.server().listen(app.conf.get('PORT'));
      var server = new SocketServer(app)
      var client = io.connect(app.server().url, options);

      client.on('sensor update', function(sensor) {
        expect(sensor.id).to.equal(app.sensors[0].id)
        done();
      });
      
      client.on('connect', function() {
        app.sensors[0].update()
      });
    });

    it('broadcasts device changes');
  });
});
