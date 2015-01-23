// Decide if a command should be executed by an endpoint

module.exports = function(endpoint, command) {
  if (command.selector.id) {
    return command.selector.id === endpoint.id;
  }

  if (command.selector.type) {
    return command.selector.type === endpoint.type;
  }

  return false;
};
