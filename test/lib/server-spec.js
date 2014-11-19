var chai = require('chai')
  , sinon = require('sinon')
  , request = require('supertest')
  , WebSocket = require('ws')
  , expect = chai.expect
  , serverFactory = require('../../lib/server').new
  , app = require('../blueprints/app')
  , endpoint = require('../blueprints/endpoint');

var port = 2000;

describe('connection', function() {
  it('refuses access without correct access token');
  it('confirms connection with correct access token');
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
  it('informs client of invalid message', function(done) {
    request(server)
      .post('/command')
      .send()
      .expect(417)
      .end(function(err, res) {
        if (err) throw err;
        server.close();
        done();
      });
  });

  it('informs client of invalid instruction', function(done) {
    var postParams = {
      'selector': {'id':123}
      // no command
    };

    request(server)
      .post('/command')
      .send(postParams)
      .expect(400)
      .end(function(err, res) {
        server.close();
        if (err) return done(err);
        done();
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

    var srv = serverFactory(biodome);

    request(srv)
      .post('/command')
      .send({
          'selector': {'type': 'humidity'},
          'command' : {'type': 'read', 'value': null}
        })
      .expect(200)
      .end(function(err, res) {
        expect(res.body.data[0]).to.deep.equal(biodome.endpoints[0].toJSON());
        srv.close();
        if (err) return done(err);
        done();
      });
  });
});

