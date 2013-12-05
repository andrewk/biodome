node-biodome
============

[![Build Status](https://secure.travis-ci.org/andrewk/biodome-server.png?branch=master)](http://travis-ci.org/andrewk/biodome-server)

Automation and sensor network framework. Designed to be easily adapted, extended, and scaled.

This project is in active development, contribution and feedback will be warmly received.

What?
====
This is the core service providing the sole point of hardware interaction, but does not implement scheduling, environment compensation, or other use-case specific tools. These will be built as seperate services which consume the node-biodome API(s). A very high level of test coverage is maintained, with stability, ease of adoption, and ease of adaption prioritized above speed.

API
===

```
Synchronous API:
GET /devices
GET /devices/:id

GET /sensors
GET /sensors/:id

Socket broadcast events:
'sensor update' - JSON representation of a newly-updated Sensor
'device update' - JSON representation of an updated Device
```
