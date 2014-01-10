var util = require('util');

function Driver(io) {
  this.io = io;
}

Driver.prototype.fromHardware = function(obj, next) {
  obj.setState('busy');
  this.io.read(function(error, result) {
    if (error) {
      obj.error(error);
    } else {
      obj.setValue(result);
      obj.setState('ready');
      obj.emit('update:read', obj);
    }
  });
};

Driver.prototype.toHardware = function(obj, next) {
  next = next || null;
  obj.setState('busy');
  this.io.write(obj.value, function(error, result) {
    if (error) {
      obj.error(error);
      if (next) {
        next(Error(error), obj);
      }
    } else {
      obj.setState('ready');
      obj.emit('update:write', obj);
      if (next) {
        next(null, obj);
      }
    }
  });
};

module.exports = Driver;
