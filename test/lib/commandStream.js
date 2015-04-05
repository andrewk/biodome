import chai from 'chai';
import sinon from 'sinon';
import EventEmitter from 'eventemitter3';
import commandStream from '../../lib/commandStream';

describe('commandStream', function() {
  it('provides command events as stream', function() {
    const events = new EventEmitter();
    const stream = commandStream(events);
    const spy = sinon.spy();
    stream.onValue(spy);
    events.emit('command', 'foo');
    chai.expect(spy.called).to.be.true;
  });
});
