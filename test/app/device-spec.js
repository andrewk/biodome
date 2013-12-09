var chai = require("chai")
  , sinon = require("sinon")
  , expect = chai.expect
  , Device = require("../../app/device")
  , dConf = {
      "id"      : "test_device", 
      "driver"  : require("../blueprints/driver").make()
    };
 

describe('Device', function() {
  describe('#initialize', function() {
    it('has a driver', function(){
      var device = new Device(dConf);
      expect(device.driver).to.be.ok;
    });

    it('has an id', function() {
      var d = new Device(dConf);
      expect(d.id).to.equal(dConf.id);
    });

    it('has a createdAt timestamp', function() {
      var d = new Device(dConf);
      expect(d.createdAt).to.be.above(1);
    });

    it('is in the ready state when first created', function(){
      var device = new Device(dConf);
      expect(device.is("ready")).to.be.true;
    });
  });

  describe('#on', function() {
    it('should set device state to "on"', function() {
      var d = new Device(dConf);
      d.switch("on");
      expect(d.is("on")).to.be.true;
    });
  });

  describe('#off', function() {
    it('should set device state to "off"', function() {
      var d = new Device(dConf);
      d.switch("off");
      expect(d.is("off")).to.be.true;
    });

    it('writes 0 to the driver', function() {
      var d = new Device(dConf);
      d.off();
      expect(d.driver.value).to.equal(0);
    });
  });

  describe('#switch', function() {
    it('should set device state to "off" if set to "on"', function() {
      var d = new Device(dConf);
      d.switch("off");
      expect(d.is("off")).to.be.true;
      d.switch("on");
      expect(d.is("on")).to.be.true;
    });

    it('should ignore unknown states', function() {
      var d = new Device(dConf);
      d.switch("off");
      expect(d.is("off")).to.be.true;
      d.switch("squirrels!");
      expect(d.is("off")).to.be.true;
    });
  });

});

