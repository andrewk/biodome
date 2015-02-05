var chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon'),
  Rx = require('rx'),
  Endpoint = require("../../lib/endpoint");

var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

function options(base) {
  base = base || {};
  base.driver = require("../../lib/drivers/base").new(
    require('../mocks/io').new(true)
  );
  return base;
}

describe('Endpoint', function() {
  describe('#write', function() {
      it('writes!'); // YOLO
  });

  describe('#read', function() {
    it('returns IO value after successful driver read', function() {
      var e = new Endpoint(options());
      e.value = 0;
      e.driver.io.lastWrite = 1234;

      return expect(e.read()).to.be.fulfilled.then(function() {
        expect(e.value).to.equal(1234);
      });
    });
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

  describe('#commandObserver', function() {
    it.skip('executes commands approved by its commandMatcher', function() {
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
      commands.subscribe(ep.commandObserver);

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
