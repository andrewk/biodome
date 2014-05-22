var chai = require('chai')
  , assert = chai.assert
  , io = require("./io");

describe('MockIO', function() {
  describe('#read', function() {
    it('Passes for force-success IO', function() {
      var o = io.new(true);
      o.read().then(function() {
        assert(true);
      }).catch(function(e) {
        assert(false, 'Success MockIO must always fulfill read promise');
      });
    });
    it('Fails for force-fail IO', function() {
      var o = io.new(false);
      o.read().then(function() {
        assert(false, 'Failure MockIO must always reject read promise');
      }).catch(function(e) {
        assert(true);
      });
    });
  });

  describe('#write', function() {
    it('Passes for force-success IO', function() {
      var o = io.new(true);
      o.write(678).then(function() {
        assert(true);
      }).catch(function(e) {
        assert(false, 'Success MockIO must always fulfill write promise');
      });
    });
    it('Fails for force-fail IO', function() {
      var o = io.new(false);
      o.write(234).then(function(value) {
        assert(false, 'Failure MockIO must always reject write promise');
      }).catch(function(e) {
        assert(true);
      });
    });
  });
});
