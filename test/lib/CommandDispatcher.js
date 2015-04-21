import CommandDispatcher from '../../lib/CommandDispatcher';
import { spy } from 'sinon';
import { expect } from 'chai';

const events = { emit: spy() }
const cmd = new CommandDispatcher(events);

describe('CommandDispatcher', function() {
  describe('issues read command', function() {
    it('by ID alone', function() {
      cmd.dispatch({ 'id': 'foo' });
      expect(events.emit.lastCall.args[1]).to.deep.equal({
        'selector': { 'id': 'foo' },
        'instruction': { type: 'read', value: undefined }
      });
    });

    it('by type alone', function() {
      cmd.dispatch({ 'type': 'foo' });
      expect(events.emit.lastCall.args[1]).to.deep.equal({
        'selector': { 'type': 'foo' },
        'instruction': { type: 'read', value: undefined }
      });
    });
  });

  describe('issues write command', function() {
    it('using ON convenience method', function() {
      cmd.on('foo');
      expect(events.emit.lastCall.args[1]).to.deep.equal({
        'selector': { 'id': 'foo' },
        'instruction': { type: 'write', value: 1 }
      });
    });

    it('using OFF convenience method', function() {
      cmd.off('foo');
      expect(events.emit.lastCall.args[1]).to.deep.equal({
        'selector': { 'id': 'foo' },
        'instruction': { type: 'write', value: 0 }
      });
    });
  });
});
