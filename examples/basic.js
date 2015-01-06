var Rx = require('rx');
var fs = require('fs');
var biodome = require('../index');

//=============================================================================
// Demonstration of how to subcribe to individual endpoint feeds, 
// as well as merging multiple feeds into one
//
// Subscription delays and different endpoint refresh rates are used to
// demonstrate that these are "hot" observables.
//=============================================================================

// setup: make sure files exist for FileIO endpoints
fs.writeFileSync('/tmp/foo', 'ABC');
fs.writeFileSync('/tmp/qux', '123');

// setup: create our endpoints
// the endpoints begin refreshing as soon as instantiated
var endpoints = [
  biodome.endpoint({
    'type': 'dummy',
    'id': 'foo',
    'driver': biodome.drivers.base(biodome.io.file('/tmp/foo')),
    'refreshRate': 1000,
  }),

  biodome.endpoint({
    'type': 'dummy',
    'id': 'qux',
    'driver': biodome.drivers.base(biodome.io.file('/tmp/qux')),
    'refreshRate': 1500,
  })
];

var sub1 = endpoints[0].data.subscribe(
  (x) => console.log('1: next', x.toJSON()),
  (x) => console.log('1: error', x),
  () => console.log('1 complete')
);

// Subscribe to the second endpoint after 250ms
setTimeout(function() {
  var sub2 = endpoints[1].data.subscribe(
    (x) => console.log('2: next', x.toJSON()),
    (x) => console.log('2: error', x),
    () => console.log('2 complete')
  );

}, 250);

// A new data source which is a combination of all endpoints
var combinedData = Rx.Observable.merge.apply(null, endpoints.map(ep => ep.data));

combinedData.subscribe(
  (x) => console.log('Combined: next', x.toJSON()),
  (x) => console.log('Combined: error', x),
  () => console.log('Combined: complete')
);

// Shut it down after 6 seconds
setTimeout(function() {
  endpoints.forEach(ep => ep.destroy());
}, 6000);
