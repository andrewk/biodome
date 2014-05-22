var chai = require("chai")
  , expect = chai.expect
  , Endpoint = require("../../lib/endpoint");

var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

function options() {
  return { 
    driver : require("../../lib/drivers/base").new(
      require('../mocks/io').new(true)
    )
  };
}

describe('Endpoint', function() {
  describe('#write', function() {
    it('updates its value after successful driver write', function() {
      var e = new Endpoint(options());
      e.value = 0;

      return expect(e.write(1)).to.be.fulfilled.then(function() {
        expect(e.value).to.equal(1);
      });
    });

    it('sets busy to false after successful driver write', function() {
      var e = new Endpoint(options());
      e.value = 0;
      e.busy = true;

      return expect(e.write(1)).to.be.fulfilled.then(function() {
        expect(e.busy).to.be.false;
      });
    });

    it('remains busy after driver write error', function() {
      var e = new Endpoint(options());
      e.value = 0;
      e.busy = true;
      e.driver.io.alwaysResolve = false;

      return expect(e.write(1)).to.be.rejected.then(function() {
        expect(e.busy).to.be.true;
      });
    });
  });

  describe('#read', function() {
    it('returns IO value after successful driver read', function() {
      var e = new Endpoint(options());
      e.value = 0;
      e.driver.io.lastWrite = 1234;

      return expect(e.read()).to.be.fulfilled.then(function() {
        expect(e.value).to.equal(1234);
      });
    });

    it('sets busy to false after successful driver read', function() {
      var e = new Endpoint(options());
      e.value = 0;
      e.busy = true;

      return expect(e.read()).to.be.fulfilled.then(function() {
        expect(e.busy).to.be.false;
      });
    });

    it('remains busy after driver read error', function() {
      var e = new Endpoint(options());
      e.value = 0;
      e.busy = true;
      e.driver.io.alwaysResolve = false;

      return expect(e.read()).to.be.rejected.then(function() {
        expect(e.busy).to.be.true;
      });
    });
  });
});
