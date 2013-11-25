var chai = require("chai")
  , sinon = require("sinon")
  , expect = chai.expect
  , Device = require("../lib/device")
  , gpio = require("./mocks/gpio");

describe('Device', function() {
  describe('initialize()', function() {
    it('should be in the init state when first created', function(){
      var device = new Device(gpio.export(1));
      expect(device.is("init")).to.be.true;
    });

    it('should have a gpio pin', function(){
      var device = new Device(gpio.export(2));
      expect(device.gpio).to.be.ok;
    });

    it('ensures its GPIO has the direction set to out', function(){
      var device = new Device(gpio.export(1, {"direction":"in"}));
      expect(device.gpio.direction).to.equal("out");
    });
  })
});

