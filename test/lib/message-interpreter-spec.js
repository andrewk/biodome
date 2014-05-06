var chai = require("chai")
  , sinon = require("sinon")
  , assert = chai.assert
  , messager = require('../../lib/message-interpreter').new()
  , app = require('../blueprints/app').make();

describe('MessageInterpreter', function() {
  describe('#validateMessage', function() {
    it('errors on empty message', function() {
      result = messager.validateMessage('', app);
      assert(!result.valid, 'expect result to be invalid');
      assert(result.error == 'Empty message provided');
    });

    it('errors on incorrectly-formatted message', function() {
      result = messager.validateMessage('bllasddr:ASda', app);
      assert(result.error == 'Invalid message format, must be "TYPE:ID:ACTION"');
      assert(!result.valid);
    });

    it('errors on invalid endpoint type', function() {
      result = messager.validateMessage('tree:foo:update', app);
      assert(!result.valid);
      assert(result.error == 'Invalid endpoint type');
    });

    it('errors on invalid action for endpoint', function() {
      result = messager.validateMessage('sensor:foo:on', app);
      assert(!result.valid);
      assert(result.error == 'Invalid action for endpoint type');
    });

    it('errors on incorrect endpoint id', function() {
      result = messager.validateMessage('sensor:fiiij:update', app);
      assert(!result.valid);
      assert(result.error == 'Invalid sensor ID: fiiij');
    });

    it('recognises a valid message', function() {
      var id = app.devices[0].id;
      result = messager.validateMessage('device:' + id + ':on', app);
      assert(result.valid, 'expect valid result');
      assert(result.error == null);
    });

  });
});
