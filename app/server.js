var restify = require('restify')
  , lo = require('lodash');

module.exports = function(app) {

  var server = restify.createServer({
    name: app.conf.get('SERVER_NAME')
  });

  var toJson = function(obj) {
    return obj.toJson();
  };

  server.use(restify.acceptParser(server.acceptable));
  server.use(restify.queryParser());
  server.use(restify.bodyParser());

  // Devices
  server.get('/devices', function(req, res, next) {
    res.setHeader('content-type', 'application/json');
    res.send(200, lo.map(app.devices, toJson));
    return next();
  });

  server.get('/devices/:id', function(req, res, next) {
    res.setHeader('content-type', 'application/json');

    var device = app.device(req.params.id);
    if(device) {
      res.send(200, device.toJson());
    }
    else {
      res.send(404, "No device with ID '" + req.params.id + "'");
    }
    return next();
  });
  
  server.put('/devices/:id', function(req, res, next) {
    res.setHeader('content-type', 'application/json');

    var device = app.device(req.params.id);

    if(!device) {
      res.send(404, "No device with ID '" + req.params.id + "'");
      return next();
    }

    if(["on", "off"].indexOf(req.body.state) == -1) {
      return next(
        new restify.BadRequestError("Invalid device state provided")
      );
    }

    if(req.body.id != device.id) {
      return next(
        new restify.BadRequestError("URL does not match provided device")
      );
    }

    device.switch(req.body.state);
    res.send(200, device.toJson());
    return next();
  });


  return server;
}
