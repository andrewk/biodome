var biodome = require('biodome');

function s(seconds) {
  return seconds * 1000;
} 

function owfs(address) {
  return biodome.drivers.base(biodome.io.owfs(address));
}

function relay(address) {
  return biodome.drivers.inverted(biodome.io.gpio(address));
}

module.exports = biodome.endpointCollection([
  // plant environment sensors
  //---------------------------------
  biodome.endpoint({
    'type': 'plant:temp',
    'id': 'north-west-temp',
    'driver': owfs(''),
    'refreshRate': s(5),
  }),

  biodome.endpoint({
    'type': 'plant:temp',
    'id': 'temp-north-east',
    'driver': owfs('');
    'refreshRate': s(5),
  }),

  biodome.endpoint({
    'type': 'plant:temp',
    'id': 'temp-south-east',
    'driver': owfs('');
    'refreshRate': s(5),
  }),

  biodome.endpoint({
    'type': 'plant:temp',
    'id': 'temp-south-west',
    'driver':  owfs('');
    'refreshRate': s(5),
  }),

  biodome.endpoint({
    'type': 'plant:temp',
    'id': 'temp-south-west',
    'driver': owfs('');
    'refreshRate': s(5),
  }),

  // external environment sensors
  //---------------------------------
  biodome.endpoint({
    'type': 'outside:temp',
    'id': 'ambient-temp-north',
    'driver': owfs('');
    'refreshRate': s(10),
  }),

  biodome.endpoint({
    'type': 'outside:temp',
    'id': 'ambient-temp-south',
    'driver': owfs('');
    'refreshRate': s(10),
  }),

  biodome.endpoint({
    'type': 'outside:humidity',
    'id': 'ambient-humidity',
    'driver': owfs('');
    'refreshRate': s(10),
  }),

  // Thermal Battery system - fans blow hot air through tubes 
  // in a large mass, expelling cooler, dehumidified air
  //---------------------------------
  biodome.endpoint({
    'type': 'thermal:fan',
    'id': 'thermal-fan',
    'driver': relay('')
  }),

  biodome.endpoint({
    'type': 'thermal:temp',
    'id': 'thermal-intake-temp',
    'driver': owfs(''),
    'refreshRate': s(6),
  }),

  biodome.endpoint({
    'type': 'thermal:temp',
    'id': 'thermal-exhaust-temp',
    'driver': owfs(''),
    'refreshRate': s(6),
  }),

  biodome.endpoint({
    'type': 'thermal:temp',
    'id': 'thermal-mass-temp',
    'driver': owfs(''),
    'refreshRate': s(6),
  })
]);
