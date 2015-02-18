var Rx = require('rx'),
  Server = require('../lib/server'),
  router = require('../lib/server-components/router'),
  socketHandler = require('../lib/server-components/socket-handler')

var dataStream = Rx.Observable.Subject();
var commandIntentStream = Rx.Observable.Subject();
var config = {
  ssl: process.env.SSL || false,
  port: process.env.PORT,
  key: process.env.SSL_KEY,
  cert: process.env.SSL_CERT,
};

var biodomeServer = new Server(
  config,
  router(dataStream, commandIntentStream),
  socketHandler(dataStream, commandIntentStream)
);
