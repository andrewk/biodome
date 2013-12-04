var config = require('./config/app.js')
  , biodome = require('./app/app.js')
  , device = require('./app/device.js')
  , sensor = require('./app/sensor.js')
  , driver = require('./test/blueprints/driver').make()

var app = new biodome(config);

app.devices.push(new device({
  "id"  : "exhaust",
  "gpio": app.gpio.export(2)
}));

app.devices.push(new device({
  "id"  : "pump",
  "gpio": app.gpio.export(2)
}));

app.sensors.push(new sensor({
  "id" : "temp",
  "driver" : driver
}));

app.server().listen(config.get('PORT'), function() {
  console.log('%s listening at %s', app.server().name, app.server().url);
});
