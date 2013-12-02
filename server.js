var config = require('./config/app.js')
  , biodome = require('./app/app.js')
  , device = require('./app/device.js')
  , sensor = require('./app/sensor.js');

var app = new biodome(config);

app.devices.push(new device(app.gpio.export(1), "exhaust"));
app.devices.push(new device(app.gpio.export(2), "irrigation"));

app.sensors.push(new sensor({"id":"blergh"}));

app.server().listen(config.get('PORT'));
