var chai = require("chai")
  , sinon = require("sinon")
  , request = require("supertest")
  , expect = chai.expect
  , serverFactory = require('../../lib/server').factory
  , app = require('../blueprints/app');

describe('connection', function() {
  it('refuses access without correct access token');
  it('confirms connection with correct access token');
  it('sends system status data on successful connection');
});

describe('SSL connection', function() {
  it('provides an SSL certificate');
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
  it.skip('validates the message', function(done) {
    var validator = sinon.spy();
    var msgGateway = sinon.spy();
    s.msgHandler = { 
      validateMessage : validator,
      sendMessageToApp : msgGateway
    };
    done(new Error('fail')); 
  });
});

describe('app events', function() {
  it('broadcasts sensor update');
  it('broadcasts device update');
});

