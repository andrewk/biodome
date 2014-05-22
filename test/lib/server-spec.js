var chai = require('chai')
  , sinon = require('sinon')
  , request = require('supertest')
  , WebSocket = require('ws')
  , expect = chai.expect
  , servernew = require('../../lib/server').new
  , app = require('../blueprints/app')
  , endpoint = require('../blueprints/endpoint');

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
  it('informs client of invalid message', function(done) {
    var srv = servernew(app.make());
    process.env.PORT = ++port;

    srv.createSocketServer(function() {
      var ws = new WebSocket('ws://localhost:' + port);
      ws.on('open', function() {
        ws.send(null);
      });

      ws.on('message', function(message) {
        var data = JSON.parse(message);
        expect(data.type).to.equal('error');
        expect(data.message).to.equal('Invalid server message');
        ws.close();
        srv.close();
        done();
      });
    });
  });

  it('informs client of invalid instruction', function(done) {
    var srv = servernew(app.make());
    process.env.PORT = ++port;

    srv.createSocketServer(function() {
      var ws = new WebSocket('ws://localhost:' + port);
      ws.on('open', function() {
        ws.send(JSON.stringify(
          {
            'selector': {'id':123},
            // no command
          }
        ));
      });

      ws.on('message', function(message) {
        var data = JSON.parse(message);
        expect(data.type).to.equal('error');
        expect(data.message).to.equal('Invalid instruction: Missing command');
        ws.close();
        srv.close();
        done();
      });
    });
  });

});

describe('request endpoint update', function() {
  it('receives endpoint JSON after requesting update', function(done) {
    // Setup Server
    var biodome = app.make();
    biodome.endpoints = [
      endpoint.make({
        'type': 'humidity',
        'id': 'bathroom'
      })
    ];
    var srv = servernew(biodome);
    process.env.PORT = ++port;
    srv.createSocketServer(function() {
      var ws = new WebSocket('ws://localhost:' + port);

      ws.on('open', function() {
        ws.send(JSON.stringify({
          'selector': {'type': 'humidity'},
          'command' : {'type': 'read', 'value': null}
        }));
      });

      var msgCount = 0;
      ws.on('message', function(message) {
        msgCount++;
        var data = JSON.parse(message);
        expect(data.data[0]).to.deep.equal(biodome.endpoints[0].toJSON());
        ws.close();
        srv.close();
        done();
      });
    });
  });
});

