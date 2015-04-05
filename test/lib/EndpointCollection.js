var chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon'),
  Rx = require('rx'),
  RxTest = require('../rx'),
  Endpoint = require("../../lib/endpoint"),
  EndpointCollection = require("../../lib/endpoints");

describe('EndpointCollection', function() {
  it('errors if constructor param is not array of endpoints', function() {
    var badConstruct = function() {
      var dummy = new EndpointCollection([{}, 1, 4]);
    }; 

    expect(badConstruct).to.throw(TypeError, /Invalid object/);
  });

  describe('lookup by id', function() {
    var ep = new Endpoint({'id':'foo', 'type':'qux'});
    var stream = ep.data;
    var collection = new EndpointCollection([ep]);

    it('returns datastream by ID', function() {
      expect(collection.id('foo')).to.equal(stream);
    });
  });


  describe('lookup by type', function() {
    var scheduler, collection;

    beforeEach(function() {
      scheduler = new Rx.TestScheduler();

      let stream1 = scheduler.createHotObservable(
          RxTest.onNext(100, 'abc'),
          RxTest.onNext(200, 'def'),
          RxTest.onCompleted(500)
      );
      let stream2 = scheduler.createHotObservable(
          RxTest.onNext(150, '123'),
          RxTest.onNext(250, '456'),
          RxTest.onCompleted(500)
      );

      let stream3 = scheduler.createHotObservable(
          RxTest.onNext(125, 'xyz'),
          RxTest.onNext(225, 'qwerty'),
          RxTest.onCompleted(500)
      );

      collection = new EndpointCollection([
        new Endpoint({
          'id': 1,
          'type': 'foo',
          'dataStream': stream1
        }),
        new Endpoint({
          'id': 2,
          'type': 'foo',
          'dataStream': stream2
        }),
        new Endpoint({
          'id': 3,
          'type': 'qux',
          'dataStream': stream3
        })
      ]);
    });
    
    it('returns merged datastream for multiple matches', function() {
      var results = scheduler.startWithTiming(
        function() {
          return collection.type('foo');
        },
        50,
        90,
        600
      );

      RxTest.assert(results.messages, [
        RxTest.onNext(100, ['abc']),
        RxTest.onNext(150, ['123']),
        RxTest.onNext(200, ['def']),
        RxTest.onNext(250, ['456']),
        RxTest.onCompleted(500)
      ]); 
    });

    it('returns datastream for single match', function() {
      var results = scheduler.startWithTiming(
        function() {
          return collection.type('qux');
        },
        50,
        90,
        600
      );

      RxTest.assert(results.messages, [
        RxTest.onNext(125, ['xyz']),
        RxTest.onNext(225, ['qwerty']),
        RxTest.onCompleted(500)
      ]); 
    });

    it('returns empty stream when no match is found', function() {
      var results = scheduler.startWithTiming(
        function() {
          return collection.type('NOPE');
        },
        50,
        90,
        600
      );

      RxTest.assert(results.messages, []); 
    });
  });

  describe('command stream', function() {
    var scheduler, collection, stream1, stream2;

    beforeEach(function() {
      scheduler = new Rx.TestScheduler();

      stream1 = scheduler.createHotObservable(
          RxTest.onNext(100, 'foo'),
          RxTest.onNext(200, 'foo'),
          RxTest.onCompleted(500)
      );
      
      stream2 = scheduler.createHotObservable(
          RxTest.onNext(150, 'bar'),
          RxTest.onNext(250, 'bar'),
          RxTest.onCompleted(500)
      );

      collection = new EndpointCollection([]);
    });

    it('allows injecting multiple command streams', function() {
      var results = scheduler.startWithTiming(
        function() {
          collection.injectCommands(stream1);
          collection.injectCommands(stream2);
          return collection.commands;
        },
        50,
        90,
        300
      );

      RxTest.assert(results.messages, [
        RxTest.onNext(100, ['foo']),
        RxTest.onNext(150, ['bar']),
        RxTest.onNext(200, ['foo']),
        RxTest.onNext(250, ['bar']),
      ]); 

    });
  });
});
