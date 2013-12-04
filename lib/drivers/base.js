var BaseDriver = function() {
  this.value = null;

  this.updateSensor = function(sensor, callback) {
    this.read(function wrappedCallback(err) {
      sensor.markComplete();
      if("function" == typeof callback)
        callback(err, sensor);
    });
  }
}

module.exports = BaseDriver;
