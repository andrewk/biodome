var chai = require("chai")
  , sinon = require("sinon")
  , expect = chai.expect
  , Device = require("../lib/device");

describe('Device', function() {
  describe('initialize()', function() {
    it('should be in the init state when first created', function(){
      var device = new Device();
      expect(device.is("init")).to.be.true;
    })
  })
});

