var chai = require("chai")
  , expect = chai.expect
  , Device = require("../../lib/device")
  , Driver = require("../../lib/drivers/base")
  , dConf = {
      "id"      : "test_device",
      "driver"  : new Driver(require('../mocks/io').new(true))
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

  describe('#switch', function() {
    it('arg of "on" sets device value to 1', function() {
      var d = new Device(dConf);
      d.value = 0;
      d.switch('on').then(function() {
        expect(d.value).to.equal(1);
      });
    });

    it('arg of "off" sets device value to 0', function() {
      var d = new Device(dConf);
      d.value = 1;
      d.switch('off').then(function() {
        expect(d.value).to.equal(0);
      });
    });

    it('should error on unknown states', function() {
      var d = new Device(dConf);
      d.switch("squirrels!").then(function() {
        chai.assert(false, 'invalid argument must be rejected');
      }).catch(function() {
        chai.assert(true);
      });
    });
  });
});

