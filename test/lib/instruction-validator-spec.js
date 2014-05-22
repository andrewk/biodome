var chai = require('chai')
  , assert = chai.assert
  , expect = chai.expect
  , validator = require('../../lib/instruction-validator').new();

var result;

describe('InstructionValidator', function() {
  describe('#validateMessage', function() {
    it('errors on missing selector', function() {
      msg = {
        'squirrels' : {'id':'foo'},
        'command' : {'type' : 'write', 'value':  1234}
      };
      result = validator.validate(msg);
      assert(!result.valid, 'expect invalid result');
      expect(result.error).to.equal('Invalid instruction: Missing selector');
    });

    it('errors on missing command', function() {
      msg = { 'selector' : {'id':'foo'} };
      result = validator.validate(msg);
      assert(!result.valid, 'expect invalid result');
      expect(result.error).to.equal('Invalid instruction: Missing command');
    });

    it('errors on missing command type', function() {
      msg = {
        'selector' : {'id':'foo'},
        'command' : {'value':  1234}
      };

      result = validator.validate(msg);
      assert(!result.valid, 'expect invalid result');
      expect(result.error).to.equal('Invalid instruction: Invalid command');
    });

    it('passes on a valid instruction', function() {
      var msg = {
        'selector' : {'id':'foo'},
        'command' : {'type' : 'write', 'value':  1234}
      };
       
      result = validator.validate(msg);
      assert(result.valid, 'expect valid result');
      assert(result.error == null);
    });
  });
});
