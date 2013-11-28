var chai = require("chai")
  , sinon = require("sinon")
  , expect = chai.expect
  , lo = require('lodash')
  , restify = require('restify')
  , request = require('supertest')
  , conf = require('../../config/app')
  , app = require('../support/fixture-app.js')
  , device = require('../../app/device.js');

describe("REST API", function() {
  // lazy-loaded server makes first server-bound test look slow, so kick it off here
  before( function() {
    var make_server_go_now = app.server();
  });

  after( function() {
    app.server().close();
  });

  describe('GET /devices', function() {
    it('responds with 200ok', function(done) {
      request(app.server())
        .get('/devices')
        .expect(200, done);
    });

    it('responds with JSON array resource', function(done) {
      request(app.server())
        .get('/devices')
        .expect('Content-Type', /json/)
        .end(function(err, res){
          if (err) return done(err);

          expect(res.body).to.be.instanceOf(Array);
          expect(res.body).to.not.be.empty;
          expect(res.body.length).to.be.above(0);
          expect(res.body).to.deep.equal(
            lo.map(app.devices, function(d) { return d.toJson(); })
          );
          done()
        });
    });
  });

  describe('GET /devices/:id', function() {
    it('responds with 200ok', function(done) {
      request(app.server())
        .get('/devices/'+ app.devices[0].id)
        .expect(200, done);
    });

    it('responds with 404 for unknown device', function(done) {
      request(app.server())
        .get('/devices/i_am_not_real')
        .expect(404, done);
    });

    it('responds with JSON resource', function(done) {
      request(app.server())
        .get('/devices/' + app.devices[0].id)
        .expect('Content-Type', /json/)
        .end(function(err, res){
          if (err) return done(err);

          expect(res.body).to.be.instanceOf(Object);
          expect(res.body.id).to.equal(app.devices[0].id);
          done()
        });
    });
  });

  describe('PUT /devices/:id', function() {
    it('responds with 404 for unknown device', function(done) {
      request(app.server())
        .put('/devices/does_not_exist')
        .send({ "id" : "does_not_exist", "state" : "on" })
        .expect(404, done)
    });

    it('responds with 400 for unknown state', function(done) {
      request(app.server())
        .put('/devices/'+ app.devices[0].id)
        .send({ "id" : app.devices[0].id, "state" : "fooqux" })
        .expect(400, done)
    });

    it('responds with 400 for different IDs between URL & data', function(done) {
      request(app.server())
        .put('/devices/'+ app.devices[0].id)
        .send({ "id" : "not_real_id", "state" : "off" })
        .expect(400, done)
    });

    it('responds with 200 and updated device on success', function(done) {
      app.devices[0].off();

      request(app.server())
        .put('/devices/'+ app.devices[0].id)
        .send({ "id" : app.devices[0].id, "state" : "on" })
        .expect(200)
        .end(function(err, res) {
          expect(res.body.id).to.equal(app.devices[0].id);
          expect(res.body.state).to.equal("on");
          done();
        });
    });
  });

});
