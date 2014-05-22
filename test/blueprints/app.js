var appClass = require('../../lib/app.js')
  , device = require('./device')
  , endpoint = require('./endpoint')

module.exports = appClass;
module.exports.make = function() {
  var app = appClass.new();
  app.endpoints.push(device.make());
  app.endpoints.push(device.make());

  return app;
}
