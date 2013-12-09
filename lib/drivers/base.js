var BaseDriver = function() {
  this.value = null;

  this.update = function(caller, callback) {
    this.read(this.wrappedCallback(caller, callback));
  };

  this.send = function(value, caller, callback) {
    this.write(value, this.wrappedCallback(caller, callback));
  };

  this.wrappedCallback = function(caller, callback) {
    return function(err) {
      caller.driverUpdated();
      if("function" == typeof callback)
        callback(err, caller);
    }
  };
}

module.exports = BaseDriver;
