var assert = require("assert");
var expect = require("expect");
var Device = require("../lib/device");

describe('Device', function(){
  describe('initialize()', function(){
    it('should be in the init state when first created', function(){
      var device = new Device;
      expect(device.is("init")).to.be.true;
    })
  })
});

