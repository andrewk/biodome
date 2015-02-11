var chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon'),
  driver = require('../../../lib/drivers/base'),
  chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

describe('Driver::Base', function() {
  describe('#write', function() {
    it('sends value to IO', function() {
      var spy = sinon.spy();
      var writeStub = function(newValue) {
        spy(newValue);
        return Promise.resolve();
      };

      var d = driver.new({ 'write': writeStub });
      return expect(d.write(3456)).to.be.fulfilled.then(function(value) {
        expect(io.write.lastCall.args[0]).to.equal(3456);
      });
    });
  });

  describe('#read', function() {
    it('returns value from IO', function() {
      var spy = sinon.spy();
      var readStub = function() {
        spy();
        return Promise.resolve(1234);
      };

      var d = driver.new({ 'read': readStub });
      expect(d.read()).to.eventually.equal(1234);
    });
  });
});
