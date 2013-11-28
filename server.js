var config = require('./config/app.js')
  , biodome = require('./app/app.js')
  , device = require('./app/device.js');

var app = new biodome(config);

app.devices.push(new device(app.gpio.export(1), "exhaust"));
app.devices.push(new device(app.gpio.export(2), "irrigation"));

app.server().listen(config.get('PORT'));
