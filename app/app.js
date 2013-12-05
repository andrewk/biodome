var lo = require('lodash')
  , util = require('util')
  , EventEmitter = require('events').EventEmitter
  , server = require('./server')

var Biodome = function(nconf) {
  var self = this;
  self.appServer = null;

  // Setup
  self.conf = nconf;
  self.devices = [];
  self.sensors = [];

  self.gpio = (self.conf.get('NODE_ENV') == 'production') ?
    require('gpio') : require('../test/mocks/gpio.js');

  // Lazy load server
  self.server = function() {
    if(!self.appServer) {
      self.appServer = server(self);
    }

    return self.appServer;
  };

  self.addDevice = function(device) {
    device.events.on('update', function(data) {
      self.emit('device update', data);
    });

    this.devices.push(device);
  };

  self.addSensor = function(sensor) {
    // relay new readings
    sensor.events.on('update', function(data) {
      self.emit('sensor update', data);
    });

    this.sensors.push(sensor);
  };

  // Device finder
  self.device = function(id) {
    var dvs = lo.where(self.devices, {'id' : id });
    return (dvs.length == 0) ? null : dvs[0];
  };

  // Sensor finder
  self.sensor = function(id) {
    var ss = lo.where(self.sensors, {'id' : id });
    return (ss.length == 0) ? null : ss[0];
  };
};

util.inherits(Biodome, EventEmitter);

module.exports = Biodome;
