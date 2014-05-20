var endpoint = require('../../lib/endpoint');

function driver() {
  return require("../../lib/drivers/base").new(
    require('../mocks/io').new(true)
  );
}

module.exports = endpoint;

module.exports.make = function(props) {
  props = props || {};
  return new endpoint({
    'type': props.type || 'blergh',
    'id'  : props.id || 'endpoint_' + Math.floor(Math.random() * 1000),
    'driver': props.driver || driver()
  });
};
