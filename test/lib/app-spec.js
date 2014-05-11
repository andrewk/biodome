var chai = require('chai')
  , sinon = require('sinon')
  , expect = chai.expect
  , App = require('../../lib/app')
  , endpoint = require('../blueprints/endpoint');

describe('App', function() {
  describe('#endpointsWhere', function() {
    it('returns endpoints matching property=value', function() {
      var app = App.new();
      app.endpoints.push(endpoint.make({'type' : 'foo'}));
      app.endpoints.push(endpoint.make({'type' : 'bar'}));
      app.endpoints.push(endpoint.make({'type' : 'bar'}));
      var endpoints = app.endpointsWhere({'type': 'bar'});
      expect(endpoints.length).to.equal(2);
      endpoints.map(function(ep) {
        expect(ep.type).to.equal('bar');
      });
    });

    it('returns null for unrecognized id', function() {
      var app = App.new();
      expect(app.endpoint('does_not_exist')).to.be.null;
    });
  });

  describe('#endpoint', function() {
    it('returns endpoint by id', function() {
      var app = App.new();
      var s = endpoint.make();
      app.endpoints.push(s);

      expect(app.endpoint(s.id)).to.equal(s);
    });

    it('returns null for unrecognized id', function() {
      var app = App.new();
      expect(app.endpoint('does_not_exist')).to.be.null;
    });
  });
});
