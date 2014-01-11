<img src="../blob/master/assets/logo-web.png">

# biodome [![Build Status](https://secure.travis-ci.org/andrewk/biodome.png?branch=master)](http://travis-ci.org/andrewk/biodome)
## home automation you can live with

In active development, API unstable

  * [Overview](#overview)
  * [Sensors](#sensors)
  * [Devices](#devices)
  * [Application](#app)
  * [REST Server](#rest-server)
  * [WebSocket Server](#socket-server)
  * [WebSocket RPC](#rpc-server)
  * [Test Suite](#tests)
  * [License](#license)

## Overview
This is the core service, providing hardware (aka `Endpoint`) interaction. It does not implement scheduling, environment compensation, or other use-case specific tools - these will be built as seperate services. Goals include:

  * Ease of adoption by people looking to assemble home/environment/industrial automation and monitoring systems.
  * Service Oriented Architecure. Allow for deployment across machines where feasible.
  * Prefer low-cost, highly replacable hardware.
  * Ease of adaptation.

<a name="sensors"></a>
## Sensors
A Sensor reads a value, which is provided by its IO, via the driver. Sensors are INPUT. The IO could be I2C, 1-wire (owfs), UART, TCP, HTTP, shell calls; whatever you can access from node. Existing IO implementations are in [app/io](../blob/master/app/io), with the primary design goal being ease of adding new IO implementations.

The Driver instance is injected into the Sensor at instantiation:

```javascript
var temperature =  new Sensor({
  "id" : "Outside Temperature",
  "driver" : new Driver(new OwserverIO('/10.E89C8A020800/temperature'))
}));

temperature.update(function(err, sensor) {
  console.log(sensor.value);
});
```

### States and Events
Sensors states:

  * `busy` : sensor is awaiting response of asynchronous update from its driver
  * `ready`: update complete
  * `error`: communication with driver has failed (failure detection not yet implemented)

#### Sensors Events:
  __TODO__: Event API shifting too quickly right now...

## Devices
A Device is hardware which can be fed input such as relays, motors, etc. Devices are OUTPUT endpoints.

```javascript
var pump = new Device({
  "id"  : "water_pump",
  "gpio": new Driver(new GpioIO(11))
}))
```
### States and Events
Device states:

  * `busy`: switching from on to off, brb
  * `on` : Device is activated
  * `off`: Device is de-activated
  * `error` : communication with driver has failed (failure detection not yet implemented)

Device Events:

  __TODO__: Event API shifting too quickly right now...

## App

The App is the hub for accessing Devices and Sensors.

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


