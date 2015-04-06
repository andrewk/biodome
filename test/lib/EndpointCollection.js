import { expect } from 'chai';
import sinon from 'sinon';
import EventEmitter from 'eventemitter3';
import Endpoint from '../../lib/Endpoint';
import EndpointCollection from '../../lib/EndpointCollection';
import params from '../endpoint-params';

describe('EndpointCollection', function() {
  let events;
  let collection;
  let endpoints;

  beforeEach(function() {
    events = new EventEmitter();
    collection = new EndpointCollection(events);
    endpoints = [
      new Endpoint(params({ id: 1, type: 'foo' })),   
      new Endpoint(params({ id: 2, type: 'foo' })),   
      new Endpoint(params({ id: 3, type: 'bar' })),   
    ];
    collection.setEndpoints(endpoints);
  })

  it('errors if constructor param is not array of endpoints', function() {
    const coll = new EndpointCollection();
    const badConstruct = function() {
      coll.setEndpoints([{}]);
    };

    expect(badConstruct).to.throw(TypeError, /Invalid object/);
  });

  describe('data streams', function() {
    it('lookup by id', function() {
      const spy = sinon.spy();
      collection.id(1).observe(spy);
      process.nextTick(function() {
        endpoints[0].broadcastData(1234); 
        expect(spy.lastCall.args[0].value).to.equal(1234);
      });
    });

    it('lookup by type', function() {
      const spy = sinon.spy();
      collection.type('foo').observe(spy);
      process.nextTick(function() {
        endpoints[0].broadcastData(1234);
        endpoints[1].broadcastData(4321);
        expect(spy.firstCall.args[0].value).to.equal(1234);
        expect(spy.lastCall.args[0].value).to.equal(4321);
      });
    });
  });
});
