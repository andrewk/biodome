var chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon'),
  Rx = require('rx'),
  rewire = require('rewire'),
  Endpoint = rewire("../../lib/endpoint");

var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

function options(base) {
  base = base || {};
  base.id = base.id || 123,
  base.type = base.type || 'sensor',
  base.commandMatcher = base.commandMatcher || () => true;
  base.driver = require("../../lib/drivers/base").new({
    'read': () => Promise.resolve(1),
    'write': (val) => Promise.resolve(val)  
  });
  return base;
}

describe('Endpoint', function() {
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
    it('clears command stream subscription', function() {
      var e = new Endpoint(options());
      e.commandSubscription = { 'dispose': sinon.spy() };
      e.destroy();
      expect(e.commandSubscription.dispose.called).to.be.true;
    });
  });

  describe.skip('auto-refresh', function() {
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
          return Promise.resolve(1)
        };

        var e = new Endpoint({'refreshRate': 500, 'driver': {'read': readStub}});
        expect(spy.called).to.be.false;
        clock.tick(501);
        expect(spy.called).to.be.true;
        e.destroy();
      });
    });
  });

  describe('.subscribeToCommands', function() {
    it('executes write commands approved by its commandMatcher', function() {
      let opt = options();

      var ep = new Endpoint(opt);
      var spy = sinon.spy();
      var writeStub = function(value) {
        spy(value);
        return Promise.resolve(1);
      };
      ep.driver.write = writeStub;

      var commands = new Rx.Subject();
      ep.subscribeToCommands(commands);

      commands.onNext({
        'selector': {'id': 'foo'},
        'instruction': {'type': 'write', 'value': 'qux'}
      });

      expect(spy.called).to.be.true;
      expect(spy.firstCall.args[0]).to.equal('qux');
    });

    it('executes read commands approved by its commandMatcher', function() {
      let opt = options();

      var ep = new Endpoint(opt);
      var spy = sinon.spy();
      var readStub = function(value) {
        spy(value);
        return Promise.resolve(1);
      };
      ep.driver.read = readStub;

      var commands = new Rx.Subject();
      ep.subscribeToCommands(commands);

      commands.onNext({
        'selector': {'id': 'foo'},
        'instruction': {'type': 'read'}
      });

      expect(spy.called).to.be.true;
    });
  });

  describe('error handling', function() {
    it('logs driver error during write', function() {
      const errorSpy = sinon.spy();
      Endpoint.__set__('log', { 'error': errorSpy });

      const ep = new Endpoint(options());
      const writeStub = function(value) {
        return Promise.reject(0);
      };

      ep.driver.write = writeStub;

      expect(ep.write(1)).to.be.rejected.then(function() {
        expect(errorSpy.called).to.be.true;
        expect(errorSpy.lastCall.args.source).to.equal('endpoint:123');
      });
    });

    it('logs driver error during read', function() {
      const errorSpy = sinon.spy();
      Endpoint.__set__('log', { 'error': errorSpy });

      const ep = new Endpoint(options());
      const readStub = function(value) {
        return Promise.reject(0);
      };

      ep.driver.read = readStub;

      expect(ep.read(1)).to.be.rejected.then(function() {
        expect(errorSpy.called).to.be.true;
      });
    });

    describe('hardware timeout', function() {
      var clock;

      before(function() {
        clock = sinon.useFakeTimers();
      });

      after(function() {
        clock.restore();
      });

      it('write times out after this.writeTimeout', function() {
        const errorSpy = sinon.spy();
        Endpoint.__set__('log', { 'error': errorSpy });

        const ep = new Endpoint(options({'writeTimeout': 200}));
        const stub = function(value) {
          return new Promise(function(res, rej) {});
        };

        ep.driver.write = stub;
        const writePromise = ep.write(1234);
        clock.tick(201);
        expect(writePromise).to.be.rejected.then(function() {
          expect(errorSpy.called).to.be.true;
          exoect(errorSpy.lastCall.args.message).to.equal('Exceeded maximum write execution time');
        });
      });

      it('read times out after this.readTimeout', function() {
        const errorSpy = sinon.spy();
        Endpoint.__set__('log', { 'error': errorSpy });

        const ep = new Endpoint(options({'readTimeout': 200}));
        const stub = function(value) {
          return new Promise(function(res, rej) {});
        };

        ep.driver.read = stub;
        const readPromise = ep.read(1234);
        clock.tick(201);
        expect(readPromise).to.be.rejected.then(function() {
          expect(errorSpy.called).to.be.true;
          exoect(errorSpy.lastCall.args.message).to.equal('Exceeded maximum read execution time');
        });
      });
    });

  });
});
