var command = require('server-actions/command');

module.exports = function(dataStream, commandStream) {
  return function(req, res) {
    if (req.url === '/command') {
      return command(req, res, commandStream);
    }

    // TODO 404
  }
};
