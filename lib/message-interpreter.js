/**
 * Interprets server messages from clients
 * Instructs App based on those messages
 *
 * Message format: "<ENDPOINT_TYPE>:<ID>:<ACTION>"
 * Example: "update:sensor:temperature"
 */

// valid actions for endpoint types
var actionMap = {
  'device' : ['update', 'on', 'off'],
  'sensor' : ['update']
};

function MessageInterpreter(){}

var mm = MessageInterpreter.prototype;

// Returns { valid: boolean, error: string || null }
mm.validateMessage = function(msg, app) 
{
  if (!msg || msg.length == 0) {
    return this.err('Empty message provided');
  }

  var parts = msg.split(':');
  if (parts.length != 3) {
    return this.err('Invalid message format, must be "TYPE:ID:ACTION"');
  }
  
  // Validate type: device | sensor
  if (!actionMap[parts[0]]) {
    return this.err('Invalid endpoint type');
  }

  // Validate action
  if (actionMap[parts[0]].indexOf(parts[2]) == -1) {
    return this.err('Invalid action for endpoint type');
  }

  // Validate ID using endpoint finder
  if (app[parts[0]](parts[1]) == null) {
    return this.err('Invalid ' + parts[0] + ' ID: ' + parts[1]);
  }

  return { 'valid' : true, 'error': null };
};

mm.err = function(errorMsg) {
  return {
    'valid' : false,
    'error' : errorMsg 
  };
};

module.exports = MessageInterpreter;
module.exports.factory = function() {
  return new MessageInterpreter();
};
