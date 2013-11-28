var restify = require('restify')
  , config = require('./config/app.js')
  , routes = require('./app/routes.js')
  , serverApp = require('./app/server-app.js')
  , device = require('./app/device.js');

var app = new serverApp(config);

app.devices.push(new device(app.gpio.export(1), "exhaust"));
app.devices.push(new device(app.gpio.export(2), "irrigation"));

server = routes(app);
server.listen(8080);
