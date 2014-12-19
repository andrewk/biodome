// Return system status

var os = require('os');

module.exports = function statusAction(app, request, response) {

  var statusResponse = function(data) {
    response.setHeader('Content-Type', 'application/json');
    response.writeHead(200);
    response.end(JSON.stringify({
      'status': {
        'uptime' : process.uptime(),
        'load' : os.loadavg(),
        'freememory' : os.freemem() / 1024
      },
      'endpoints': data
    }));
  };

  return app.status()
    .then(statusResponse)
    .catch(function(error) {
      response.writeHead(500);
      response.end();
    });
};
