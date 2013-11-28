var chai = require("chai")
  , sinon = require("sinon")
  , expect = chai.expect
  , c = require('../../config/app')
  , A = require('../../app/server-app')
  , device = require('../../app/device')
  , mockGpio = require('../mocks/gpio');

describe("App", function() {
  describe('#new', function() {
    it('uses mock GPIO in development', function() {
      var app = new A(c);
      expect(app.gpio).to.deep.equal(mockGpio);
    });

    it('has an empty devices array', function() {
      var app = new A(c);
      expect(app.devices.length).to.equal(0);
    });
  });

  describe('#device', function() {
    it('returns device by id', function() {
      var app = new A(c);
      var d = new device(app.gpio.export(1), "test");
      app.devices.push(d);

      expect(app.device("test")).to.equal(d);
    });

    it('returns null for unrecognized id', function() {
      var app = new A(c);
      var d = new device(app.gpio.export(1), "test");
      app.devices.push(d);

      expect(app.device("does_not_exist")).to.be.null;
    });

  });
});
