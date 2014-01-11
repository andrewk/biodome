var chai = require("chai")
  , sinon = require("sinon")
  , expect = chai.expect
  , sensor = require("../../lib/sensor")
  , Driver = require("../../lib/driver")
  , io = require("../blueprints/io").make()
  , driver = new Driver(io);

describe('Sensor', function() {
  describe('#initialize', function() {
    it('has an ID', function() {
      var s = new sensor({'id':'sensor_id', "driver": driver});
      expect(s.id).to.equal('sensor_id');
    });
  });

  describe('#update', function() {
    it('transitions state to `busy`, then to `ready`', function(done) {
      var s = new sensor({'id':'sensor_id', "driver": driver})
        , cbBusy = sinon.spy()
        , cbReady = sinon.spy()

      s.on('busy', cbBusy);
      s.on('ready', cbReady);

      s.update(function(err, sensorReturn) {
        expect(cbBusy.called).to.be.true;
        expect(cbReady.called).to.be.true;
        done();
      });
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
