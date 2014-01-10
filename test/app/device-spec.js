var chai = require("chai")
  , sinon = require("sinon")
  , expect = chai.expect
  , Device = require("../../app/device")
  , Driver = require("../../app/driver")
  , dConf = {
      "id"      : "test_device", 
      "driver"  : new Driver(require('../blueprints/io').make())
    };
 

describe('Device', function() {
  describe('#initialize', function() {
    it('has a driver', function() {
      var device = new Device(dConf);
      expect(device.driver).to.be.ok;
    });

    it('has an id', function() {
      var d = new Device(dConf);
      expect(d.id).to.equal(dConf.id);
    });
  });

  describe('#on', function() {
    it('should set device state to "on"', function(done) {
      var d = new Device(dConf);
      d.on(function(err, dd) {
        expect(dd.isState("on")).to.be.true;
        done();
      });
    });
  });

  describe('#off', function() {
    it('should set device state to "off"', function(done) {
      var d = new Device(dConf);
      d.off(function() {
        expect(d.isState("off")).to.be.true;
        done();
      });
    });
  });

  describe('#switch', function() {
    it('should set device state to "off" if set to "on"', function() {
      var d = new Device(dConf);
      d.switch("off");
      expect(d.isState("off")).to.be.true;
      d.switch("on");
      expect(d.isState("on")).to.be.true;
    });

    it('should ignore unknown states', function() {
      var d = new Device(dConf);
      d.switch("off");
      expect(d.isState("off")).to.be.true;
      d.switch("squirrels!");
      expect(d.isState("off")).to.be.true;
    });
  });
});

