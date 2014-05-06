var chai = require("chai")
  , expect = chai.expect
  , Endpoint = require("../../lib/endpoint");

var options = {};
options.driver = require("../../lib/drivers/base").new(
  require('../mocks/io').new(true)
);

describe('Endpoint', function() {
  describe('#write', function() {
    it('updates its value after successful driver write', function() {
      var e = new Endpoint(options);
      e.value = 0;

      e.write(1).then(function() {
        expect(e.value).to.equal(1);
      }).catch(function(e) {
        chai.assert(false, 'Write failed');
      });
    });

    it('sets busy to false after successful driver write', function() {
      var e = new Endpoint(options);
      e.value = 0;
      e.busy = true;

      e.write(1).then(function() {
        expect(e.busy).to.be.false;
      }).catch(function(e) {
        chai.assert(false, 'Write failed');
      });
    });
  });

  describe('#read', function() {
    it('returns IO value after successful driver read', function() {
      var e = new Endpoint(options);
      e.value = 0;
      e.driver.io.value = 1234;

      e.read().then(function(value) {
        expect(value).to.equal(1234);
        expect(e.value).to.equal(1234);
      }).catch(function(e) {
        chai.assert(false, 'Read failed');
      });
    });

    it('sets busy to false after successful driver read', function() {
      var e = new Endpoint(options);
      e.busy = true;

      e.read().then(function() {
        expect(e.busy).to.be.false;
      }).catch(function(e) {
        chai.assert(false, 'Read failed');
      });
    });
  });
});
