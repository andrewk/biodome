var fs = require('fs')
  , restify = require('restify')
  , conf = require('config/app.js')
  , serverApp = require('app/server-app.js')
  , device = require('app/device.js');


var app = new serverApp(conf);
