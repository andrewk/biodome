var restify = require('restify')
  , lo = require('lodash');

module.exports = function(app) {

  var server = restify.createServer({
    name: 'BiodomeServer'
  });

  var toJson = function(obj) {
    return obj.toJson();
  };

  server.use(restify.acceptParser(server.acceptable));
  server.use(restify.queryParser());
  server.use(restify.bodyParser());

  server.get('/devices', function(req, res, next) {
    res.setHeader('content-type', 'application/json');
    res.send(200, lo.map(app.devices, toJson));
    return next();
  });

  server.get('/devices/:id', function(req, res, next) {
    res.setHeader('content-type', 'application/json');

    var device = lo.where(app.devices, {'id' : req.params.id })[0];
    if(device) {
      res.send(200, device.toJson());
    }
    else {
      res.send(404, "No device with ID '" + req.params.id + "'");
    }
    return next();
  });

  return server;
}
