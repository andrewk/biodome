var util = require('util')
  , Endpoint = require('./endpoint');

var Sensor = function(opt) {
  var self = this;

  this.id = opt.id;
  this.driver = opt.driver;

  this.update = function(next) {
    this.driver.fromHardware(this, next);
  };
};

util.inherits(Sensor, Endpoint);
module.exports = Sensor;
