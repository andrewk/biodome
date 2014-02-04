var util = require('util');

function Driver(io) {
  this.io = io;
}

Driver.prototype.fromHardware = function(obj, next) {
  next = next || null;
  // some hardware requires time to update, indicate a read is in progress
  obj.setState('busy');
  this.io.read(function(error, result) {
    if (error) {
      obj.error(error);
      if (next) {
        next(Error(error), obj);
      }
    } else {
      obj.setValue(result);
      obj.setState('ready');
      obj.emit('update:read', obj);
      if (next) {
        next(null, obj);
      }
    }
  });
};

Driver.prototype.toHardware = function(obj, next) {
  next = next || null;
  this.io.write(obj.value, function(error, result) {
    if (error) {
      obj.error(error);
      if (next) {
        next(Error(error), obj);
      }
    } else {
      obj.emit('update:write', obj);
      if (next) {
        next(null, obj);
      }
    }
  });
};

module.exports = Driver;
module.exports.factory = function(parentObj, cb) {
  return new Driver(parentObj, cb);
};
