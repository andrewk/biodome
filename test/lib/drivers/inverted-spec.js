var chai = require('chai')
  , expect = chai.expect
  , io = require('../../mocks/io')
  , driver = require('../../../lib/drivers/inverted');

describe('Driver::Base', function() {
  describe('#write', function() {
    it('sends inverted value to IO', function(done) {
      var d = driver.new(io.new(true));
      d.write(1).then(function(value) {
        expect(d.io.lastWrite).to.equal(0);
        done();
      });
    });
  });

  describe('#read', function() {
    it('returns inverted value from IO', function(done) {
      var i = io.new(true);
      var d = driver.new(i);
      i.lastWrite = 1;
      d.read().then(function(value) {
        expect(value).to.equal(0);
        done();
      });
    });
  });
});
