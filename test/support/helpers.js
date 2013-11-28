var conf = require('../../config/app.js')
  , serverApp = require('../../app/server-app')
  , routes = require('../../app/routes')
  , restify = require('restify')

var Helpers = function() {
  var self = this;

  self.newApp = function() {
    var app = new serverApp(conf);
    return app;
  };

  self.jsonClient = function(conf) {
    return restify.createJsonClient(
      {
        url: conf.get('PROTOCOL') + '://' + conf.get('HOSTNAME') + ':' + conf.get('TEST_PORT'),
        version: "*"
      }
    );
  };
};

module.exports = Helpers;
