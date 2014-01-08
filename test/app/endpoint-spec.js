var chai = require("chai")
  , sinon = require("sinon")
  , expect = chai.expect
  , ep = require("../../app/endpoint")

describe('Endpoint', function() {
  describe('#setValue', function() {
    it('updates value');
    it('updates timestamp');
  });

  describe('#setState', function() {
    it('updates state');
    it('updates timestamp');
    it('only updates if new state is different');
  });
});
