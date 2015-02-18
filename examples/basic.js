//=============================================================================
// - Configuring and instantiating Endpoints
// - Subscribing to Endpoint data
// - Merging and querying multiple Endpoint data streams
//=============================================================================
'use strict';

var Rx = require('rx');
var fs = require('fs');
var biodome = require('../index');

// setup: make sure files exist for FileIO endpoints
fs.writeFileSync('/tmp/biodome-demo-kiln', 499);
fs.writeFileSync('/tmp/biodome-demo-exhaust', 480);

//==================================================
// Setup
// ================================================

// setup: create our endpoints, just use files as sensors for easy demo
// the endpoints begin refreshing as soon as instantiated
var endpoints = [
  biodome.endpoint({
    'type': 'temperature',
    'id': 'kiln',
    'driver': biodome.drivers.base(biodome.io.file('/tmp/biodome-demo-kiln')),
    'refreshRate': 1000,
  }),

  biodome.endpoint({
    'type': 'temperature',
    'id': 'kiln:exhaust',
    'driver': biodome.drivers.base(biodome.io.file('/tmp/biodome-demo-exhaust')),
    'refreshRate': 1500,
  })
];

function createObserver(label) {
  return Rx.Observer.create(
    (x) => console.log(label + ': next\n', x.toJSON()),
    (x) => console.log(label + ': error', x),
    () => console.log(label + ' complete')
  );
}

var sub1 = endpoints[0].data.subscribe(createObserver('One'));
var sub2;

// Subscribe to the second endpoint after 250ms
setTimeout(
  () => sub2 = endpoints[1].data.subscribe(createObserver('Two')),
  250
);

// Combination data streams
var combinedData = Rx.Observable.merge.apply(null, endpoints.map(ep => ep.data));
combinedData.subscribe(createObserver('Combined'));

// Querying observable for warnings, actions etc
// =============================================

// OH NOES, Bad things!
combinedData.
  filter(ep => ep.type === 'temperature' && ep.value > 900).
  subscribe(ep => console.log('~[ IT\'S OVER 900!!! ]~'));

// How about something a bit more useful
combinedData.
  bufferWithTime(3000, 500).
  subscribe((data) => {
    let max = data.map(d => d.value).reduce((a,b) => a >= b ? a : b);
    let min = data.map(d => d.value).reduce((a,b) => a <= b ? a : b);

    if (max - min >= 500) {
      console.log('DANGER: Temperature is fluctuating too fast');
    }
  });


// lets do some random writes...
var randomWrites = setInterval(
  () => {
    endpoints.
      forEach((ep) => {
        ep.write(Math.floor(Math.random() * 1000)).
        then(e => console.log('--------- wrote ' + e.value ));
      });
  },
  1400
);

// Shut it down after 10 seconds
setTimeout(
  () =>  {
    endpoints.forEach(ep => ep.destroy());
    clearInterval(randomWrites);
    process.exit(0);
  },
  10000
);
