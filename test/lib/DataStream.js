import { expect } from 'chai';
import sinon from 'sinon';
import EventEmitter from 'eventemitter3';
import Endpoint from '../../lib/Endpoint';
import DataStream from '../../lib/DataStream';
import params from '../endpoint-params';

describe('EndpointCollection', function() {
  let events;
  let data;
  let endpoints;

  beforeEach(function() {
    events = new EventEmitter();
    data = new DataStream(events);
    endpoints = [
      new Endpoint(params({ id: 1, type: 'foo', events: events })),   
      new Endpoint(params({ id: 2, type: 'foo' , events: events })),   
      new Endpoint(params({ id: 3, type: 'bar', events: events })),   
    ];
  });

  describe('data streams', function() {
    it('lookup by id', function() {
      const spy = sinon.spy();
      data.id(1).observe(spy);
      process.nextTick(function() {
        endpoints[0].broadcastData(1234); 
        expect(spy.lastCall.args[0].value).to.equal(1234);
      });
    });

    it('lookup by type', function() {
      const spy = sinon.spy();
      data.type('foo').observe(spy);
      process.nextTick(function() {
        endpoints[0].broadcastData(1234);
        endpoints[1].broadcastData(4321);
        expect(spy.firstCall.args[0].value).to.equal(1234);
        expect(spy.lastCall.args[0].value).to.equal(4321);
      });
    });
  });
});
