var gpio = require('gpio')
  , conf = require('../../config/app')

var GpioIO = function(pinNumber, direction, callback) {
  var self = this;
  self.hardware = gpio.export(
    pinNumber, 
    {
      "direction": direction, 
      "ready": callback
    }
  );

  this.read = function(callback) {
    // GPIO uses a filewatcher to update its value
    if(self.hardware.direction == "in") {
      callback(null);
    }
    else {
      self.hardware.setDirection("in");
      // nasty hack due to GPIO package passing value as first 
      // param to callback, rather than error
      self.hardware._get(function() {callback()});
    }
  };

  this.write = function(value, callback) {
    self.hardware.set(value, callback);
  }
};

module.exports = GpioIO;
