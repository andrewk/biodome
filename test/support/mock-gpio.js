var util = require('util');
var EventEmitter = require('events').EventEmitter;

// Mock of GPIO interface, including events
var GPIO = function(headerNum, opts) {
  opts = opts || {};

  var self = this;
  var dir = opts.direction;
  var interval = opts.interval;
  if(typeof interval !== 'number') interval = 100;

  this.interval = interval;
  this.headerNum = headerNum;
  this.value = 0;

  this.export = this.unexport = function(callback) {
    if (typeof callback === "function") callback();
  };

  this.setDirection = function(dir) {
    if(typeof dir !== "string" || dir !== "in") dir = "out";
    this.direction = dir;
    this.emit('directionChange', dir);
  };

  this.set = function(value, callback) {
    self.value = value;
    self.emit('valueChange', value);
    self.emit('change', value);
    if (typeof callback === "function") callback();
  };

  this.reset = function(callback) {
    self.set(0, callback);
  };

  this.export(function() {
    self.setDirection(dir);
    if(typeof opts.ready === 'function') opts.ready.call(self);
  });
};

util.inherits(GPIO, EventEmitter);

exports.export = function(headerNum, direction) { return new GPIO(headerNum, direction); };
