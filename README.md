<cimg src="https://github.com/andrewk/node-biodome/raw/master/assets/logo-web.png">

# Biodome

**Home Automation for node.js**


## Motivation
This project started as an Arduino sensor logger and relay controller in 2008, which I wrote because I wanted to log garden data to CSV and was disappointed with the quality and versatility of existing Arduino projects solving similar problems. Over time rewriting the project in different languages and different programming styles became a non-trivial exercise I used to learn and evaluate the strengths and weaknesses of a language or programming approach. The first JavaScript implementation quickly showed extensive benefits over the multiple Arduino and Ruby implementations that proceeded it, leading me to continue development with the intention of releasing a maintained, documented codebase for others to utilize.

## Goals
  * Ease of adoption by people looking to assemble and program home/environment automation and monitoring systems.
  * Service Oriented Architecture. Allow for deployment across multiple machines where feasible.
  * Suitable for low-cost, highly replacable hardware.
  * Ease of long-term maintenance and modification. Needs change, conditions change, and a Biodome installation needs to painlessly change. This is *automation you can live with*.


## What does it do?

Biodome provides a reactive interface to reading data (sensors, APIs, etc) and pushing commands to devices based on that data. Biodome's [API client](https://github.com/andrewk/biodome-client) exposes this same reactive interface to services running in different process or hardware. This enables you to move services such as scheduling, logging, and user interfaces out of your main biodome process, isolating the device and sensor controller from their potential instability and resource needs.

By using [most](https://github.com/cujojs/most) to provide an Observable interface to your sensor data, Biodome enables you to express complex conditions in a functional syntax and then act upon those by injecting commands into the command stream.

## Fundemental concepts

The core of a Biodome system are two observable streams. Every service in the system -- whether it be in the server or accessing via the socket API -- shares these streams. In this way, horizontal scaling is eased by moving endpoints or functionality to different hardware without significant impact on the code for those areas of concern.

### Data stream
The data stream is an observable containing data from Endpoints. All Endpoints within a system share a data stream. Each endpoint publishes to the data stream at the highest frequency it is capable of. It is up to consumers to throttle and filter the data stream.

### Command stream
All commands for devices (represented as Endpoints) are published to the command stream. Any command-generating part of the system (eg: a scheduler) publishes to the stream at its highest frequency. If some endpoints need their command frequency limited for hardware reasons, this is to be enforced by the Endpoint in its command subscription.

## System Design

### Endpoint

The Endpoints are the most important component. They consume instructions from a command stream, and produce a data stream. If the Endpoint is a device, such as a relay or LCD, you'll be most interested in its command stream. If it's a sensor, you'll be more interested in its data stream.

An Endpoint's identifying information is its `id` – which is expected to be unique – and its `type`, a free text property to allow you to group Endpoints within the system. Each endpoint requires a Driver, which in turn requires an IO instance. This composition is designed to enable a wide range of hardware support without constantly defining new types of Endpoints just to support minor differences.

### Driver

Each Endpoint needs a driver. The role of the driver is any data translation required by Endpoint hardware. One example is inverting the logic for normally closed (NC) relays, allowing you to write `1` for closed and `0` for open. Another example is converting characters to suitable character codes for an LCD endpoint. As these conversions are indifferent of the transmission protocol, they belong in the driver. The implementation of a driver is a `read` and `write` method that calls its IO instance's `read` or `write` method and does any required translation on the way through. Both methods must return promises.

### IO

Each Driver needs an IO instance. IO is responsible for handling the transmission protocol between the Biodome server and the Endpoint. GPIO, I2C, serial, file (eg: OWFS), HTTP, UDP, whatever you can think of. You can support different transports by providing an IO that implements `read` and `write`, returning promises for each. This design facilitates using existing callback-based protocol support, while also making it easy to pass any errors up to the Driver and in turn to the Endpoint where they can be handled (generally by injecting them into an error stream).

## [TODO]: Document Server

## Tests
Run `npm test`

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
