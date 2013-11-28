var chai = require("chai")
  , sinon = require("sinon")
  , expect = chai.expect
  , sensor = require("../../app/sensor")

describe('Sensor', function() {
  describe('#initialize', function() {
    it('has an ID', function() {
      var s = new sensor('sensor_id');
      expect(s.id).to.equal('sensor_id');
    });

    it('has a null value property', function() {
      var s = new sensor('sensor_id');
      expect(s.value).to.be.null;
    });
  });

  describe('#update', function() {
    it('emits `busy` event', function(done) {
      var s = new sensor('foo');
      var cb = sinon.spy();
      s.events.on('busy', cb);
      s.update();
      expect(cb.called).to.be.true;
      done();
    });

    it('transitions state to `busy`, then to `ready`', function(done) {
      var s = new sensor('foo')
        , cbBusy = sinon.spy()
        , cbReady = sinon.spy()

      s.events.on('busy', cbBusy);
      s.events.on('ready', cbReady);

      s.update();
      expect(cbBusy.called).to.be.true;
      expect(cbReady.called).to.be.true;
      done();
    });

    it('supports optional callback', function() {
      var s = new sensor('id')
        , cb = sinon.spy();
      s.update(cb);
      expect(cb.called).to.be.true;
    });

    it('updates timestamp', function() {
      clock = sinon.useFakeTimers();
      var s = new sensor('q');
      var before = s.updatedAt;
      clock.tick(500);
      s.update();

      expect(s.updatedAt).to.be.above(before);
      clock.restore();
    });
  });
});
