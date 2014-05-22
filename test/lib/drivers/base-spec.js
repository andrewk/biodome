var chai = require('chai')
  , expect = chai.expect
  , io = require('../../mocks/io')
  , driver = require('../../../lib/drivers/base');

describe('Driver::Base', function() {
  describe('#write', function() {
    it('sends value to IO', function(done) {
      var d = driver.new(io.new(true));
      d.write(3456).then(function(value) {
        expect(d.io.lastWrite).to.equal(3456);
        done();
      });
    });
  });

  describe('#read', function() {
    it('returns value from IO', function(done) {
      var i = io.new(true);
      var d = driver.new(i);
      i.lastWrite = 1234;
      d.read().then(function(value) {
        expect(value).to.equal(1234);
        done();
      });
    });
  });
});
