var chai = require("chai")
  , sinon = require("sinon")
  , expect = chai.expect
  , driver = require('../../../app/driver')
  , io = require('../../../app/io/owserver');

describe('OwserverIO', function() {
  describe('#read', function() {
    it('calls its owserver client', function(done) {
      var d = new driver(new io('/1234567'));
      var stub = sinon.stub(d.client, "read");
      
      d.read(function(err) {
        expect(d.client.read.called).to.be.true;
        d.client.read.restore();
        done();   
      });

      stub.callArg(1);
    });
  });
});
