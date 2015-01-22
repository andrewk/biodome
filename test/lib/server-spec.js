var chai = require('chai'),
  sinon = require('sinon'),
  request = require('supertest'),
  ws = require('ws'),
  expect = chai.expect,
  Server = require('../../lib/server'),
  srv;

describe('connection', function() {
  it('refuses access without correct access token');
  it('confirms connection with correct access token');
});

describe('Correct handlers are used', function() {
  var requestSpy, socketSpy;

  beforeEach(function() {
    requestSpy = sinon.spy();
    socketSpy = sinon.spy();

    var requestHandler = function(req, res) {
      requestSpy();
      res.end('200');
    };

    var socketHandler = function(client) {
      socketSpy();
      client.close();
    };

    srv = new Server({'port': 6676}, requestHandler, socketHandler);
  });

  it('uses composed request handler', function(done) {
    request(srv.http).
      post('/test').
      send().
      end(function(err, res) {
        expect(requestSpy.called).to.be.true;
        srv.close();
        done();
      });
  });

  it('uses composed socket handler', function(done) {
    var client = new ws('ws://localhost:6676');
    client.on('open', function() {
      expect(socketSpy.called).to.be.true;
      srv.close();
      done(); 
    });
  });
});
