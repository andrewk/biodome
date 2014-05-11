var chai = require('chai')
  , assert = chai.assert
  , expect = chai.expect
  , validator = require('../../lib/instruction-validator').new();

var result;

describe('InstructionValidator', function() {
  describe('#validateMessage', function() {
    it('errors on empty message', function() {
      result = validator.validateSet('');
      assert(!result.valid, 'expect result to be invalid');
      expect(result.error).to.equal('Empty instruction set provided');
    });

    it('errors on incorrectly-formatted message', function() {
      result = validator.validateSet({bllasddr:"ASda"});
      expect(result.error).to.equal('Instruction set must be an array');
      assert(!result.valid);
    });

    it('errors on missing selector', function() {
      msg = [
        {
          'selector' : {'id':'foo'},
          'command' : {'type' : 'write', 'value':  1234}
        },
        {
          'squirrels' : {'id':'foo'},
          'command' : {'type' : 'write', 'value':  1234}
        }
      ];
      result = validator.validateSet(msg);
      assert(!result.valid, 'expect invalid result');
      expect(result.error).to.equal('Invalid instruction: Missing selector in instruction 2');
    });

    it('errors on missing command', function() {
      msg = [
        {
          'selector' : {'id':'foo'},
          'command' : {'type' : 'write', 'value':  1234}
        },
        {
          'selector' : {'id':'foo'},
        }
      ];
      result = validator.validateSet(msg);
      assert(!result.valid, 'expect invalid result');
      expect(result.error).to.equal('Invalid instruction: Missing command in instruction 2');
    });

    it('errors on missing command type', function() {
      msg = [
        {
          'selector' : {'id':'foo'},
          'command' : {'type' : 'write', 'value':  1234}
        },
        {
          'selector' : {'id':'foo'},
          'command' : {'value':  1234}
        }
      ];
      result = validator.validateSet(msg);
      assert(!result.valid, 'expect invalid result');
      expect(result.error).to.equal('Invalid instruction: Invalid command in instruction 2');
    });

    it('passes on a valid instruction set', function() {
      var msg = [
        {
          'selector' : {'id':'foo'},
          'command' : {'type' : 'write', 'value':  1234}
        },
        {
          'selector' : {'id':'foo'},
          'command' : {'type': 'write', 'value':  1234}
        }
      ];
      result = validator.validateSet(msg);
      assert(result.valid, 'expect valid result');
      assert(result.error == null);
    });
  });
});
