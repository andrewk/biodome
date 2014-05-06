var endpoint = require('../../lib/endpoint')
  , driver = require('../../lib/drivers/base')
  , io = require('../mocks/io').new();

module.exports = endpoint;

module.exports.make = function(props) {
  props = props || {};
  return new endpoint({
    'type': props.type || 'blergh',
    'id'  : props.id || 'endpoint_' + Math.floor(Math.random() * 100),
    'driver': props.driver || new driver(io)
  });
};
