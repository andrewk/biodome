// Forward an HTTP API command as an observable

var http = require('http');

module.exports =  function(request, response, commandIntentStream) {
  if (request.method !== 'POST') {
    return httpResponse(405, response);
  }

  var body = '';
  request.setEncoding('utf8');
  request.on('data', function (chunk) {
    body += chunk;

    if (body.length > 1e6) {
      httpResponse(413, response);
      request.connection.destroy();
      return null;
    }
  })

  // when request is complete, attempt to parse command and push into command stream
  request.on('end', function () {
    try {
      var command = JSON.parse(body);
      commandIntentStream.onNext(command);
      return httpResponse(201, response);

    } catch(error) {
      // could not parse JSON
      return httpResponse(417, response);
    }
  });
};

function httpResponse(httpCode, response) {
  response.writeHead(httpCode);
  response.end(http.STATUS_CODES[httpCode]);
}
