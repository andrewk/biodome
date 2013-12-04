var chai = require("chai")
  , sinon = require("sinon")
  , expect = chai.expect
  , sensor = require("../../app/sensor")
  , driver = require("../blueprints/driver").make()

describe('Sensor', function() {
  describe('#initialize', function() {
    it('has an ID', function() {
      var s = new sensor({'id':'sensor_id', "driver": driver});
      expect(s.id).to.equal('sensor_id');
    });
  });

  describe('#update', function() {
    it('emits `busy` event', function(done) {
      var s = new sensor({'id':'sensor_id', "driver": driver});
      var cb = sinon.spy();
      s.events.on('busy', cb);
      s.update();
      expect(cb.called).to.be.true;
      done();
    });

    it('defers sensor reading to its driver', function(done) {
      sinon.stub(driver, "read");
      var s = new sensor({
        "id":"test",
        "driver": driver
      });
      s.update();

      expect(driver.read.called).to.be.true;
      driver.read.restore();
      done();
    });

    it('transitions state to `busy`, then to `ready`', function(done) {
      var s = new sensor({'id':'sensor_id', "driver": driver})
        , cbBusy = sinon.spy()
        , cbReady = sinon.spy()

      s.events.on('busy', cbBusy);
      s.events.on('ready', cbReady);

      s.update();
      expect(cbBusy.called).to.be.true;
      expect(cbReady.called).to.be.true;
      done();
    });

    it('updates timestamp', function() {
      clock = sinon.useFakeTimers();
      var s = new sensor({'id':'q', "driver": driver});
      var before = s.updatedAt;
      clock.tick(500);
      s.update();

      expect(s.updatedAt).to.be.above(before);
      clock.restore();
    });

    it('supports a callback', function(done) {
      var s = new sensor({'id':'asdf', 'driver':driver});

      var cb = function(err, sensor) {
        expect(sensor).to.equal(s);
        done();
      };

      s.update(cb);
    });
  });
});
