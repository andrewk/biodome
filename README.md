<img src="https://github.com/andrewk/node-biodome/raw/master/assets/logo-web.png">

# biodome [![Build Status](https://secure.travis-ci.org/andrewk/biodome.png?branch=master)](http://travis-ci.org/andrewk/biodome)

**home automation for node.js**

  * [Overview](#overview)
  * [Endpoints](#endpoints)
  * [Application](#app)
  * [Server](#app)
  * [Tests](#tests)
  * [License](#license)

## Overview
This is the core service, providing hardware (aka `Endpoint`) interaction. It does not implement scheduling, environment compensation, or other use-case specific tools - these will be built as seperate services. Goals include:

  * Ease of adoption by people looking to assemble home/environment/industrial automation and monitoring systems.
  * Service Oriented Architecure. Allow for deployment across machines where feasible.
  * Prefer low-cost, highly replacable hardware.
  * Ease of adaptation.

<a name="endpoints"></a>
## Endpoints

An Endpoint is a device or sensor which the system owns. The IO could be I2C, 1-wire (owfs), UART, TCP, HTTP, shell calls; whatever you can access from node. An **Endpoint** instance contains a **Driver** instance, which contains an **IO** instance. The Driver and IO layers have clearly defined roles, and are composed together to simplify their implementations and allow re-use.

### Drivers

The role of the driver is any data translation required to achieve the desired result at the endpoint hardware. One example is inverting the logic for relay boards which use HIGH as off, and LOW as on (eg: relay boards sold by Futurlec). For such an endpoint, you would use an inverting driver to send a 1 to the IO when a value of 0 is passed to the Endpoint's `write` method. Another example might be converting characters to suitable character codes for an LCD endpoint. 

### IO

IO is responsible for handling the transmission protocol between the Biodome server and the Endpoint. It knows nothing of the devices or sensors it is providing for, only how to get a provided value down the wire or across the airwaves to an endpoint. In the case of multiplexing, a shared multiplexing IO instance would abstract away all that complexity form the drivers and endpoints, which would not need to make any account for their shared means of communication.

A convenience API is provided for shorthand instantiation:
```javascript
var bio = require('biodome');

var temperature =  bio.endpoint({
  "id" : "Outside Temperature",
  "driver" : bio.drivers.base(bio.io.owserver('/10.E89C8A020800/temperature'))
}));

temperature.read().then(function(result) {
  console.log(result.value);
});
```

Alternatively, this will give the same result:

```javascript
var Endpoint = require('biodome/lib/endpoint')
  , BaseDriver = require('biodome/lib/drivers/base')
  , OwserverIO = require('biodome/lib/io/owserver');

var temperature =  new Endpoint({
  "id" : "Outside Temperature",
  "driver" : new BaseDriver(new OwserverIO('/10.E89C8A020800/temperature'))
}));

temperature.read().then(function(result) {
  console.log(result.value);
});
```
I shifting too quickly right now...

## App

The App provides a JSON API for controlling endpoints and an API for selecting a subgroup of endpoints from its endpoint array

### `endpoint` method

```javascript
// return single endpoint or null, lookup by properties
var porchLight = app.endpoint({id: 'porch', 'type': 'light'});

porchLight.write(1).then(function(json) {
  console.log('Light turned on at ' + json.updatedAt);
});
```

### `endpointsWhere` method

```javascript
// return array of endpoints, lookup by properties
var tempSensors = app.endpointsWhere({'type' : 'temp'});

// update all their values and return their toJSON output
Promise.all(tempSensors.map(function(ep) {
  return ep.read();
}).then(function(resultsJSON) {
  console.log(resultsJSON);
});
```

### App Instructions Interface

The `executeInstruction` method expects an instruction object in the following format:

```
{
  'selector' : {'id' : 'LCD1'},
  'command' : {'type' : 'write', 'value' : 'Hello World' }
}
```

`selector` is the same format as expected by the `endpointsWhere` method.
`command` can have a `type` of `read` or `write`

Validation is performed by the `InstructionValidator` class.

## Server
The Server provides a websocket API to the App's instruction interface. It expects messages of serialized JSON App instructions, and returns messages of serialized JSON result sets.

### Server security
**TODO**

<a name="tests"></a>
## Tests!
Run `mocha` or `npm run tests`

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


