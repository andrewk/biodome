var bunyan = require('bunyan');
module.exports = bunyan.createLogger({
  name: 'biodome-client',
  stream: process.stdout
});
