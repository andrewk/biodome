// Controller for a phase change climate battery.
// See http://www.sunnyjohn.com/indexpages/shcs.htm

'use strict';

var Rx = require('rx'),
  biodome = require('../index'),
  endpoints = require('./endpoints');

var plantTemperature = 
  endpoints.type('plant:temp').
    windowWithCount(4).
    average(x => x.value);

var highTemp = 
  plantTemperature.
    filter(t => t > 27);

var massAndPlantTemperatureDelta = 
  endpoints.id('mass_temperature').
    combineLatest(
      plantTemperature,
      (mass, plants) => plants - mass
    );

// If high temp event occurs with mass likely to drop
// forced air below dew point turn on fan (write 1), 
// else turn fan off (write 0)
var thermalFanInstruction = 
  hightTemp.
    combineLatest(
      massAndPlantTemperatureDelta,
      (t, d) => d > 10 ? 1 : 0
    );
