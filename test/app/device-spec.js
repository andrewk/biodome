var chai = require("chai")
  , sinon = require("sinon")
  , expect = chai.expect
  , Device = require("../../app/device")
  , gpio = require("../mocks/gpio");

describe('Device', function() {
  describe('#initialize', function() {
    it('has a gpio pin', function(){
      var device = new Device(gpio.export(2));
      expect(device.gpio).to.be.ok;
    });

    it('ensures its GPIO has the direction set to out', function(){
      var device = new Device(gpio.export(1, {"direction":"in"}));
      expect(device.gpio.direction).to.equal("out");
    });

    it('has an id', function() {
      var d = new Device(gpio.export(1), "switch");
      expect(d.id).to.equal("switch");
    });

    it('has a createdAt timestamp', function() {
      var d = new Device(gpio.export(1), "switch");
      expect(d.createdAt).to.be.above(1);
    });

    it('is in the off state when first created', function(){
      var device = new Device(gpio.export(1));
      expect(device.is("off")).to.be.true;
    });
  });

  describe('#on', function() {
    it('should set device state to "on"', function() {
      var d = new Device(gpio.export(1));
      d.on();
      expect(d.is("on")).to.be.true;
    });

    it('should set GPIO value to 1', function() {
      var d = new Device(gpio.export(1));
      d.on();
      expect(d.gpio.value).to.equal(1);
    });
  });

  describe('#off', function() {
    it('should set device state to "off"', function() {
      var d = new Device(gpio.export(1));
      d.off();
      expect(d.is("off")).to.be.true;
    });

    it('should set GPIO value to 0', function() {
      var d = new Device(gpio.export(1));
      d.off();
      expect(d.gpio.value).to.equal(0);
    });
  });

  describe('#switch', function() {
    it('should set device state to "off" if set to "on"', function() {
      var d = new Device(gpio.export(1));
      expect(d.is("off")).to.be.true;
      d.switch("on");
      expect(d.is("on")).to.be.true;
    });

    it('should ignore unknown states', function() {
      var d = new Device(gpio.export(1));
      expect(d.is("off")).to.be.true;
      d.switch("squirrels!");
      expect(d.is("off")).to.be.true;
    });
  });

});

