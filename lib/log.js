var bunyan = require('bunyan');
module.exorts = bunyan.createLogger({
  name: 'biodome-client',
  stream: process.stdout
});
