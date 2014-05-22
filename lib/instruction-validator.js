/**
 * Instruction format:
 * [
 *   {
 *     'selector' : {'id':'soil', 'type':'temp'},
 *     'command' : {'type': 'read', 'value': null}
 *   },
 *   {
 *     'selector' : {'id': 'LCD'},
 *     'command' : {'type': 'write', 'value': 'Hello World' }
 *   }
 * ]
 */

function InstructionValidator(){}

var util = require('util');
var mm = InstructionValidator.prototype;

mm.validate = function(inst) {
  // Validate Selector
  if (!inst['selector']) {
    return this.err('Invalid instruction: Missing selector');
  }
  if (typeof inst.selector !== 'object') {
    return this.err('Invalid instruction: Invalid selector');
  }

  if (!inst['command']) {
    return this.err('Invalid instruction: Missing command');
  }
  if (['read', 'write'].indexOf(inst.command.type) === -1) {
    return this.err('Invalid instruction: Invalid command');
  }
  
  return { 'valid': true, 'error': null };
};

mm.err = function(errorMsg) {
  return {
    'valid' : false,
    'error' : errorMsg
  };
};

module.exports = InstructionValidator;
module.exports.new = function() {
  return new InstructionValidator();
};
