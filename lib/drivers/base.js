var BaseDriver = function() {
  this.fromHardware = function(obj) {
    obj.setState('busy');
    this.read(funciton(error, result) {
      if (error) {
        obj.error(error);
      } else {
        obj.setValue(result);
        obj.setStatus('ready');
        obj.emit('update:read', obj);
      }
    });
  };

  this.toHardware = function(obj) {
    obj.setState('busy');
    this.write(obj.value, function(err, result) {
      if (error) {
        obj.error(error);
      } else {
        obj.setStatus('ready');
        obj.emit('update:write', obj);
      }
    });
  };
}

module.exports = BaseDriver;
