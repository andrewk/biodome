var gpio = require('gpio')
  , conf = require('../../config/app')
  , base = require('./base');

var GpioDriver = function(pinNumber, direction, callback) {
  var self = this;
  self.hardware = gpio.export(
    pinNumber, 
    {
      "direction": direction, 
      "ready": callback
    }
  );

  this.read = function(callback) {
    // GPIO uses a filewather to update its value
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

GpioDriver.prototype = new base;

module.exports = GpioDriver;
