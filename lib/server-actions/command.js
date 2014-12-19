//
// Validate and execute an app command

var http = require('http');

module.exports =  function(app, request, response) {
  if (request.method !== 'POST') {
    return errorResponse(405, response);
  }

  var body = '';
  request.setEncoding('utf8');
  request.on('data', function (chunk) {
    body += chunk;

    if (body.length > 1e6) {
      errorResponse(413, response);
      request.connection.destroy();
    }
  })

  // the end event tells you that you have entire body
  request.on('end', function () {
    try {
      app.executeCommand(JSON.parse(body))
        .then(function(result) {
          response.writeHead(200, {
            'Content-type' : 'application/json'
          });
          response.end(
            JSON.stringify({'data' : result })
          );
        }).catch(function(error) {
          // Bad command
          response.writeHead(400);
          response.end(error.message);
        });
    } catch(error) {
      // could not parse JSON
      return errorResponse(417, response);
    }
  }.bind(this));
};

function errorResponse(httpCode, response) {
  response.writeHead(httpCode);
  response.end(http.STATUS_CODES[httpCode]);
}
