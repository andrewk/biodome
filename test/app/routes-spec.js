var chai = require("chai")
  , sinon = require("sinon")
  , expect = chai.expect
  , lo = require('lodash')
  , restify = require('restify')
  , request = require('supertest')
  , conf = require('../../config/app')
  , app = require('../support/fixture-app.js')
  , server = require('../../app/routes')(app)
  , device = require('../../app/device.js');

describe("routes", function() {
  after( function() {
    server.close();
  });

  describe('/devices', function() {
    it('responds to GET with 200ok', function(done) {
      request(server)
        .get('/devices')
        .expect(200, done);
    });

    it('responds with JSON array resource', function(done) {
      request(server)
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

  describe('/devices/:id', function() {
    it('responds to GET with 200ok', function(done) {
      request(server)
        .get('/devices/'+ app.devices[0].id)
        .expect(200, done);
    });

    it('responds with 404 for unknown device', function(done) {
      request(server)
        .get('/devices/i_am_not_real')
        .expect(404, done);
    });


    it('responds with JSON resource', function(done) {
      request(server)
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


});
