var BaseDriver = function() {
  this.value = null;

  this.update = function(caller, callback) {
    this.read(function wrappedCallback(err) {
      caller.driverUpdated();
      if("function" == typeof callback)
        callback(err, caller);
    });
  }
}

module.exports = BaseDriver;
