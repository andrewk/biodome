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

    it('is in the init state when first created', function(){
      var device = new Device(dConf);
      expect(device.isState("init")).to.be.true;
    });
  });

  describe('#on', function() {
    it('should set device state to "on"', function() {
      var d = new Device(dConf);
      d.on();
      expect(d.isState("on")).to.be.true;
    });
  });

  describe('#off', function() {
    it('should set device state to "off"', function() {
      var d = new Device(dConf);
      d.off();
      expect(d.isState("off")).to.be.true;
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

  describe('#inheritStateFromDriver', function() {
    it('turns on if the driver value is 1', function(done) {
      dConf.driver.write(1);
      var d = new Device(dConf);
      expect(d.isState("init")).to.be.true;
      d.inheritStateFromDriver(function() {
        expect(d.isState("on")).to.be.true;
        done();
      });
    });
  });

});

