// Controller for a phase change climate battery.
// See http://www.sunnyjohn.com/indexpages/shcs.htm

'use strict';

var Rx = require('rx'),
  biodome = require('../index'),
  endpoints = require('./endpoints');

// Average the temp across the 4 sensors
var plantTemperature = 
  endpoints.type('plant:temp').
    windowWithCount(4).
    average(x => x.value);

// If high temp event occurs with mass likely to drop
// forced air below dew point turn on fan (write 1), 
// else turn fan off (write 0)
var thermalFanCommands = 
  plantTemperature.
    combineLatest(
      endpoints.id('thermal-mass-temp'),
      (plantTemp, massTemp) => {
        let val = (plantTemp > 27 && plantTemp - massTemp > 10) ? 1 : 0;
        return biodome.command('thermal-fan', val);
      }
    ).distinctUntilChanged();

// Inject fan commands into command intent stream
endpoints.injectCommands(thermalFanCommands);
