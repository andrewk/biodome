function DummyIO() {};

DummyIO.prototype.read = function(callback) {
  var result = this.value ||  Math.floor(Math.random() * 100);
  callback(null, result );
}

DummyIO.prototype.write = function(value, callback) {
  this.value = value;
  if("function" == typeof callback) callback(null, value);
}

module.exports = DummyIO;
module.exports.make = function() { return new DummyIO() };
