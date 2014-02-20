var chai = require("chai")
  , sinon = require("sinon")
  , request = require("supertest")
  , WebSocket = require('ws')
  , expect = chai.expect
  , serverFactory = require('../../lib/server').factory
  , app = require('../blueprints/app');

var port = 2000;

describe('connection', function() {
  it('refuses access without correct access token');
  it('confirms connection with correct access token');
  it('sends system status data on successful connection');
});

describe('server status', function() {
  before(function() {
    server = serverFactory(app.make());
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
    var srv = serverFactory(
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
});

describe('app events', function() {
  it('broadcasts endpoint update', function(done) {
    // Setup Server
    var biodome = app.make();
    var srv = serverFactory(biodome);
    process.env.PORT = ++port;
    srv.createSocketServer(function() {
      var ws = new WebSocket('ws://localhost:' + port);
      
      ws.on('open', function() {
        // cause some update events
        biodome.devices[0].switch('on');
      });

      ws.on('message', function(message) {
        expect(JSON.parse(message)['data'])
          .to.deep.equal(biodome.devices[0].toJSON());
        ws.close();
      });


      ws.on('close', function() {
        // expect received update
        srv.close();
        done();
      });
    });
  });
});

