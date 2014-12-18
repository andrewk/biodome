/**
 * Command format:
 *   {
 *     'selector' : {'id': 'LCD'},
 *     'instruction' : {'type': 'write', 'value': 'Hello World' }
 *   }
 */

module.exports = function validator(command) {
  // Validate Selector
  if (!command['selector']) {
    return commandError('Invalid command: Missing selector');
  }
  if (typeof command.selector !== 'object') {
    return commandError('Invalid command: Invalid selector');
  }

  if (command['instruction'] === undefined) {
    return commandError('Invalid command: Missing instruction');
  }
  if (['read', 'write'].indexOf(command.instruction['type']) === -1) {
    return commandError('Invalid command: Invalid instruction');
  }

  return { 'valid': true, 'error': null };
};

function commandError(errorMsg) {
  return {
    'valid' : false,
    'error' : errorMsg
  };
};
