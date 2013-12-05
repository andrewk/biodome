# node-biodome

__JavaScript Framework for Automation and Sensor Systems__ 

Version 0.0.0 - in active development, not yet fully fleshed out

[![Build Status](https://secure.travis-ci.org/andrewk/node-biodome.png?branch=master)](http://travis-ci.org/andrewk/node-biodome)

  * [Sensors](#sensors)
  * [Devices](#devices)
  * [Application](#app)
  * [REST Server](#rest-server)
  * [WebSocket Server](#socket-server)
  * [WebSocket RPC](#rpc-server)
  * [Test Suite](#tests)
  * [License](#license)

## Overview
This is the core service, providing hardware interaction. It does not implement scheduling, environment compensation, or other use-case specific tools - these will be built as seperate services.

### Goals
  * Ease of adoption by people looking to assemble home/environment/industrial automation and monitoring systems.
  * Service Oriented Architecure. Allow for deployment across machines where feasible.
  * Prefer low-cost, highly replacable hardware.
  * Ease of adaptation.

<a name="sensors"></a>
## Sensors
A Sensor reads a value, which is provided by its Driver. The Driver could be talking to I2C, 1-wire (owfs), UART, TCP, HTTP, shell calls; whatever you can access from node. Existing Drivers are in [lib/drivers](../blob/master/lib/drivers).

The Driver instance is injected into the Sensor at instantiation:

```javascript
var temperature =  new Sensor({
  "id" : "temp",
  "driver" : new OwserverDriver('/10.E89C8A020800/temperature')
}));

temperature.update(function(err, sensorJson) {
  console.log(sensorJson);
});
```

### States and Events
Sensors states:

  * `init` : newly-created sensor in the process of being setup
  * `busy` : sensor is awaiting response of asynchronous update from its driver
  * `ready`: update complete
  * `error`: communication with driver has failed (failure detection not yet implemented)

Sensors possess an EventEmitter instance as their `events` property. All state changes are emitted, along with an `update` event whenever a new sensor reading is available.

### Protocol/Hardware Support
To add support for different sensors, your driver needs to implement a `read` method and inherit from `BaseDriver`. Updating happens asyncronously, with a JSON representation of the updated sensor provided to the callback. Drivers are also the place to enforce sensor hardware access limitations, eg:

 * limiting the frequency of update for a humidity sensor so it doesn't burn out.
 * caching HTTP calls if you want to scrape multiple signals from a single HTML page.

The expectation is that the Driver will return its `value` from the previous reading, unless
Here is a simple example Driver, reading Dallas 1-wire sensors from owserver:

```javascript
var owjs = require('owjs')
  , conf = require('../../config/app')
  , Base = require('./base');

var OwserverDriver = function(deviceAddress) {
  var self = this;
  self.deviceAddress = deviceAddress;
  self.client = new owjs.Client({host: conf.get('owserver_ip')});

  this.read = function(callback) {
    self.client.read(self.deviceAddress, function(err, result) {
      self.value = result;
      callback(err);
    });
  }
};

OwserverDriver.prototype = new Base;
```

<a name="devices"></a>
## Devices
A Device is hardware which can be fed input such as relays, motors, cameras, etc. Device switching is currently by GPIO only. Rewriting hardware support to use Drivers is a high priority.

```javascript
var pump = new Device({
  "id"  : "water_pump",
  "gpio": app.gpio.export(2) // TODO
}))
```

<a name="app"></a>
## App

The App is the hub for accessing Devices and Sensors. It also echos events from its Sensors and Devices, decoupling the services watching from the hardware under observation.

<a name="rest-server"></a>
## REST Server

A basic synchronous HTTP API is implemented using `restify` and available for extension via `app.server()`. The server is lazy-loaded on first call and is not listening on any port until its `listen` method is called. This service is indended as read-only.

API endpoints:
```
GET /status  # TODO
GET /devices
GET /devices/:id
GET /sensors
GET /sensors/:id
```

<a name="socket-server"></a>
## Socket Server

SocketServer listens to `app.server().

Socket broadcast events:
```
'sensor update' - JSON representation of a newly-updated Sensor
'device update' - JSON representation of an updated Device
```

<a name="socket-rpc"></a>
### Socket RPC

RPC API for JavaScript via WebSockets. Not yet implemented.

<a name="tests"></a>
## Tests!
Run `npm test` or `make test`

<a name="license"></a>
## License

The MIT License (MIT)

Copyright (c) 2013 Andrew Krespanis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


