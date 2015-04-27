import chai from 'chai';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import InvertedDriver from '../../../lib/drivers/inverted';

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Driver::Inverted', function() {
  describe('#write', function() {
    it('sends inverted value to IO', function() {
      var spy = sinon.spy();
      var writeStub = function(newValue) {
        spy(newValue);
        return Promise.resolve();
      };

      var d = new InvertedDriver({ 'write': writeStub });
      return expect(d.write(1)).to.be.fulfilled.then(function(value) {
        expect(spy.lastCall.args[0]).to.equal(0);
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

      var d = new InvertedDriver({'read': readStub });
      expect(d.read()).to.eventually.equal(1);
    });
  });
});
