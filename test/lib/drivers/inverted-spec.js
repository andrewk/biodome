var chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon'),
  driver = require('../../../lib/drivers/inverted'),
  chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

describe('Driver::Base', function() {
  describe('#write', function() {
    it('sends inverted value to IO', function() {
      var spy = sinon.spy();
      var writeStub = function(newValue) {
        spy(newValue);
        return Promise.resolve();
      };

      var d = driver.new({ 'write': writeStub });
      return expect(d.write(1)).to.be.fulfilled.then(function(value) {
        expect(io.write.lastCall.args[0]).to.equal(0);
      });
    });
  });

  describe('#read', function() {
    it('returns inverted value from IO', function() {
      var spy = sinon.spy();
      var readStub = function() {
        spy();
        return Promise.resolve(0);
      };

      var d = driver.new({'read': readStub });
      expect(d.read()).to.eventually.equal(1);
    });
  });
});
