function Driver(io) {
  this.io = io;
}

Driver.prototype.read = function() {
  return this.io.read();
}

Driver.prototype.write = function(value) {
  return this.io.write(value);
}

module.exports = Driver;
module.exports.new = function(io) {
  return new Driver(io);
};
