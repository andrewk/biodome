var chai = require("chai")
  , spies = require("chai-spies");

chai.use(spies);

var expect = chai.expect;
var gpio = require("./support/mock-gpio");

describe("mock-gpio", function() {
  describe('#exports', function() {
    it('should set the headerNum', function() {
      var pin = gpio.export(4);
      expect(pin.headerNum).to.equal(4);
    }); 

    it('should default to direction = out', function() {
      var pin = gpio.export(4);
      expect(pin.direction).to.equal("out");
    }); 
    
    it('should set the direction', function() {
      var pin = gpio.export(4, {"direction": "in"});
      expect(pin.direction).to.equal("in");
    });

    it('should default to value = 0', function() {
      var pin = gpio.export(1);
      expect(pin.value).to.equal(0);
    });

   it('should default to interval of 100', function() {
      var pin = gpio.export(1);
      expect(pin.interval).to.equal(100);
    });

    it('should set the interval', function() {
      var pin = gpio.export(2, {"interval": 99});
      expect(pin.interval).to.equal(99);
    });

    it('should execute the opts.ready callback');
  });

  describe('#setDirection', function() {
    it('should change the direction', function() {
      var pin = gpio.export(2, {"direction": "in"});
      expect(pin.direction).to.equal("in");
      pin.setDirection("out");
      expect(pin.direction).to.equal("out");
    });

    it('should fire a `directionChange` event');
  });

  describe('#set', function() {
    it('should change the value', function() {
      var pin = gpio.export(2);
      expect(pin.value).to.equal(0);
      pin.set(1);
      expect(pin.value).to.equal(1);
    });

    it('should execute the callback');
    it('should fire a `valueChange` event');
    it('should fire a `change` event');
  });
})
