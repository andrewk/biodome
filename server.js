var config = require('./config/app')
  , biodome = require('./app/app')
  , device = require('./app/device')
  , socket = require('./app/socket-server')
  , sensor = require('./app/sensor')
  , driver = require('./test/blueprints/driver').make()
  , gpio = require('./lib/drivers/gpio')

var app = new biodome(config);
var socketServer = socket(app);

app.addDevice(new device({
  "id"  : "exhaust",
  "driver": new gpio(2, {"direction":"out"})
}));

app.addDevice(new device({
  "id"  : "pump",
  "driver": new gpio(4, {"direction":"out"})
}));

app.addSensor(new sensor({
  "id" : "temp",
  "driver" : driver
}));

app.server().listen(config.get('PORT'), function() {
  console.log('%s listening at %s', app.server().name, app.server().url);
});
