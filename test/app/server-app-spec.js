var chai = require("chai")
  , sinon = require("sinon")
  , expect = chai.expect
  , c = require('../../config/app')
  , A = require('../../app/server-app')
  , mockGpio = require('../mocks/gpio');

describe("App", function() {
  describe('#new', function() {
    it('uses mock GPIO in development', function() {
      var app = new A(c);
      expect(app.gpio).to.deep.equal(mockGpio);
    });

    it('uses hardware GPIO in production', function() {
      var app = new A(c);
      expect(app.gpio).to.deep.equal(mockGpio);
    });

    it('has an empty devices array', function() {
      var app = new A(c);
      expect(app.devices.length).to.equal(0);
    });
  });
});
