var chai = require("chai")
  , sinon = require("sinon")
  , expect = chai.expect;

var A = require('../lib/app.js')
  , nconf = require('nconf');
describe("App", function() {
  describe('#new', function() {
    it('uses mock GPIO in development', function() {
      var app = new A();
      expect(app.gpio).to.deep.equal(require('./mocks/gpio'));
    });

    it('uses hardware GPIO in production', function() {
      nconf.overrides({"NODE_ENV" : "production"});
      var app = new A();
      expect(app.gpio).to.deep.equal(require('./mocks/gpio'));
    });
  });

  describe('.devices', function() {
    it('contains an array of device instances');
  });
});
