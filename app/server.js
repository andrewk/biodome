var restify = require('restify')
  , lo = require('lodash');

module.exports = function(app) {

  var server = restify.createServer({
    name: app.conf.get('SERVER_NAME')
  });

  server.use(restify.acceptParser(server.acceptable));
  server.use(restify.queryParser());
  server.use(restify.bodyParser());

  // Devices
  server.get('/devices', function(req, res, next) {
    res.setHeader('content-type', 'application/json');
    res.send(200, lo.map(app.devices, function(d) {return d.toJSON()}));
    return next();
  });

  server.get('/devices/:id', function(req, res, next) {
    res.setHeader('content-type', 'application/json');

    var device = app.device(req.params.id);
    if(device) {
      res.send(200, device.toJSON());
    }
    else {
      res.send(404, "No device with ID '" + req.params.id + "'");
    }
    return next();
  });
  
  // Sensors
  server.get('/sensors', function(req, res, next) {
    res.setHeader('content-type', 'application/json');
    res.send(200, lo.map(app.sensors, function(s) {return s.toJSON()}));
    return next();
  });

  server.get('/sensors/:id', function(req, res, next) {
    res.setHeader('content-type', 'application/json');

    var sensor = app.sensor(req.params.id);
    if(sensor) {
      res.send(200, sensor.toJSON());
    }
    else {
      res.send(404, "No sensor with ID '" + req.params.id + "'");
    }
    return next();
  });

  return server;
}
