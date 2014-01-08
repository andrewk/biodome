var util = require('util')
  , Endpoint = require('./endpoint');

var Sensor = function(opt) {
  var self = this;

  this.id = opt.id;
  this.driver = opt.driver;

  this.update = function() {
    this.driver.fromHardware(this);
  };
};

util.inherit(Sensor, Endpoint);
module.exports = Sensor;
