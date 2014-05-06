var chai = require("chai")
  , sinon = require("sinon")
  , request = require("supertest")
  , WebSocket = require('ws')
  , expect = chai.expect
  , servernew = require('../../lib/server').new
  , app = require('../blueprints/app');

var port = 2000;

describe('connection', function() {
  it('refuses access without correct access token');
  it('confirms connection with correct access token');
});

describe('server status', function() {
  before(function() {
    server = servernew(app.make());
  });

  it('responds with JSON server uptime and system stats', function(done) {
    request(server)
      .get('/status')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;
        server.close();
        done();
      });
  });
});

describe('client message received', function() {
  it('passes message to messageHandler', function(done) {
    var validatorCalled = false;
    var senderCalled = false;
    var srv = servernew(
      app.make(),
      {
        validateMessage : function(msg, app) {
          validatorCalled = true;
          return { 'valid' : true, 'error' : null };
        },
        sendMessageToApp : function(msg, app) {
          senderCalled = true;
        }
      }
    );
    process.env.PORT = ++port;

    srv.createSocketServer(function() {
      var ws = new WebSocket('ws://localhost:' + port);
      ws.on('open', function() {
        ws.send('noop');
        ws.close();
      });
      ws.on('close', function() {
        expect(validatorCalled).to.be.true;
        expect(senderCalled).to.be.true;
        srv.close();
        done();
      });
    });
  });

  it('informs client of invalid message', function(done) {
    var srv = servernew(
      app.make(),
      {
        validateMessage : function(msg, app) {
          return { 'valid' : false, 'error' : 'Such fail.' };
        },
        sendMessageToApp : function(msg, app) {}
      }
    );
    process.env.PORT = ++port;

    srv.createSocketServer(function() {
      var ws = new WebSocket('ws://localhost:' + port);
      ws.on('open', function() {
        ws.send('noop');
      });

      ws.on('message', function(message) {
        var data = JSON.parse(message);
        expect(data.type).to.equal('error');
        expect(data.message).to.equal('Such fail.');
        ws.close();
        srv.close();
        done();
      });
    });
  });

});

describe('app events', function() {
  it('broadcasts endpoint update', function(done) {
    // Setup Server
    var biodome = app.make();
    var srv = servernew(biodome);
    process.env.PORT = ++port;
    srv.createSocketServer(function() {
      var ws = new WebSocket('ws://localhost:' + port);

      ws.on('open', function() {
        // cause some update events
        biodome.devices[0].switch('on');
        biodome.sensors[0].update();
      });

      var msgCount = 0;
      ws.on('message', function(message) {
        msgCount++;
        var data = JSON.parse(message);
        if (data['type'] == 'device') {
          expect(data.data).to.deep.equal(biodome.devices[0].toJSON());
        }

        if (data['type'] == 'sensor') {
          expect(data.data).to.deep.equal(biodome.sensors[0].toJSON());
        }

        if (msgCount == 2) {
          ws.close();
          srv.close();
          done();
        }
      });
    });
  });
});

