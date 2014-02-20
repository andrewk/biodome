var util = require('util')
  , Endpoint = require('./endpoint');

var Sensor = function(opt) {
  Endpoint.call(this, 'sensor');
  this.id = opt.id;
  this.driver = opt.driver;
};

util.inherits(Sensor, Endpoint);

Sensor.prototype.update = function(next) {
  this.driver.fromHardware(this, next);
};

module.exports = Sensor;
module.exports.factory = function(opts) {
  return new Sensor(opts);
}
