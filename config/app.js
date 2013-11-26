var nconf = require('nconf');

// setup global config
nconf.argv()
     .env();

nconf.defaults({
  'NODE_ENV' : "development"
});

module.exports = nconf
