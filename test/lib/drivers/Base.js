import chai from 'chai';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import Driver from '../../../lib/drivers/base';

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Driver::Base', function() {
  describe('#write', function() {
    it('sends value to IO', function() {
      var spy = sinon.spy();
      var writeStub = function(newValue) {
        spy(newValue);
        return Promise.resolve();
      };

      var d = new Driver({ 'write': writeStub });
      return expect(d.write(3456)).to.be.fulfilled.then(function(value) {
        expect(spy.lastCall.args[0]).to.equal(3456);
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

      var d = new Driver({ 'read': readStub });
      expect(d.read()).to.eventually.equal(1234);
    });
  });
});
