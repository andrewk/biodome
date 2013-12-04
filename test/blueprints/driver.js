var DummyDriver = function() {
  var self = this;
  self.value = null;

  self.updateSensor = function(sensor, callback) {
    sensor.value = self.read();
    sensor.markComplete();
    if("function" == typeof callback)
      callback(null, sensor);
  }

  self.read = function(callback) {
    self.value = Math.floor(Math.random() * 100);
  }
};

module.exports = DummyDriver;
module.exports.make = function() { return new DummyDriver() };
