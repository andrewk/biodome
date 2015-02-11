var chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon'),
  Rx = require('rx'),
  Endpoint = require("../../lib/endpoint");

var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

function options(base) {
  base = base || {};
  base.driver = require("../../lib/drivers/base").new({});
  return base;
}

describe('Endpoint', function() {
  describe('.write', function() {
    var ep, spy, writeStub;

    beforeEach(function() {
      spy = sinon.spy();
      writeStub = function(newValue) {
        spy(newValue);
        // resolve to something other than input to ensure correct value comes back
        return Promise.resolve(1);
      };

      ep = new Endpoint({'driver': {'write': writeStub}});
    });

    it('calls .driver.write', function() {
      ep.write(3);
      expect(spy.called).to.be.true;
      expect(spy.lastCall.args[0]).to.equal(3);
    });

    it('calls .broadcastData after resolving driver.write', function() {
      ep.broadcastData = sinon.spy();
      return expect(ep.write(3)).to.be.fulfilled.then(function() {
        expect(ep.broadcastData.called).to.be.true;
        expect(ep.broadcastData.lastCall.args[0].value).to.equal(1);
      });
    });
  });

  describe('.read', function() {
    var ep, spy, readStub;

    beforeEach(function() {
      spy = sinon.spy();
      readStub = function() {
        spy();
        return Promise.resolve(1);
      };

      ep = new Endpoint({'driver': {'read': readStub}});
    });

    it('calls .driver.read', function() {
      ep.read();
      expect(spy.called).to.be.true;
    });

    it('calls .broadcastData after resolving driver.read', function() {
      ep.broadcastData = sinon.spy();
      return expect(ep.read()).to.be.fulfilled.then(function() {
        expect(ep.broadcastData.called).to.be.true;
        expect(ep.broadcastData.calls[0].args[0].value).to.equal(1);
      });
    });
  });

  describe('.broadcastData', function() {
    it('publishes to this.data.onNext', function() {
      var spy = sinon.spy();
      var ep = new Endpoint(
        options({
          'id': 4,
          'type': 1,
          'dataStream': {
            'onNext': spy
          }
        })
      );

      ep.broadcastData(123);
      expect(spy.lastCall.args[0].value).to.equal(123);
      expect(spy.lastCall.args[0].id).to.equal(4);
      expect(spy.lastCall.args[0].type).to.equal(1);
      expect(spy.lastCall.args[0].timestamp).to.be.ok;
    });
  });

  describe('.destroy', function() {
    it('clears auto refresh interval');
    it('clears command stream subscription');
  });

  describe('auto-refresh', function() {
    it('creates up an interval timer if endpoint has a refresh rate', function() {
      setInterval = sinon.spy();
      var e = new Endpoint(options({'refreshRate': 500}));
      expect(setInterval.called).to.be.true;
    });

    it('doesn\'t create an interval timer if endpoint has no refresh rate', function() {
      setInterval = sinon.spy();
      var e = new Endpoint(options());
      expect(setInterval.called).to.be.false;
    });

    describe('active refresh', function() {
      var clock;

      before(function() {
        clock = sinon.useFakeTimers();
      });

      after(function() {
        clock.restore();
      });

      it('calls endpoint.read', function() {
        var spy = sinon.spy();
        var readStub = function() {
          spy();
          return Promise.resolve(1);
        };

        var e = new Endpoint({'refreshRate': 500, 'driver': {'read': readStub}});
        expect(spy.called).to.be.false;
        clock.tick(501);
        expect(spy.called).to.be.true;
        e.destroy();
      });
    });
  });

  describe('#subscribeToCommands', function() {
    it('executes commands approved by its commandMatcher', function() {
      let opt = options();
      opt.commandMatcher = function() {
        return true;
      };

      var ep = new Endpoint(opt);
      var spy = sinon.spy();
      var writeStub = function(value) {
        spy(value);
        return Promise.resolve(1);
      };
      ep.write = spy;

      var commands = new Rx.Subject();
      ep.subscribeToCommands(commands);

      commands.onNext({
        'selector': {'id': 'foo'},
        'instruction': {'type': 'write', 'value': 'qux'}
      });

      expect(spy.called).to.be.true;
      expect(spy.firstCall.args[0]).to.equal('qux');
    });
  });

  describe('error handling', function() {
    it('publishes IO errors to the error stream');
  });
});
