var Endpoint = require('./endpoint'),
  Rx = require('rx'),
  endpoints = [];

var Collection = function(endpointArray) { 
  this.commands = new Rx.Subject();

  for (var i = 0, ii = endpointArray.length; i < ii; i++) {
    if (!(endpointArray[i] instanceof Endpoint)) {
      throw new TypeError('Invalid object supplied to EndpointCollection');
    }

    this.commands.subscribe(endpointArray[i].commandObserver);
  }

  endpoints = endpointArray;
};

Collection.prototype.id = function(id) {
  let ep = endpoints.filter(e => e.id === id)[0];
  return (ep) ? ep.data : new Rx.Subject();
};

Collection.prototype.type = function(type) {
  let matches = endpoints.filter(e => e.type === type);
  if (matches.length) {
    return this.merge(matches);
  } else {
    return new Rx.Subject();
  }
};

// Merge endpoint streams
Collection.prototype.merge = function(endpointArray) {
  return Rx.Observable.merge(endpointArray.map(ep => ep.data));
}

// add a stream to the commands stream
Collection.prototype.injectCommands = function(commandStream) {
  commandStream.multicast(this.commands).connect(); 
};

module.exports = Collection;
module.exports.new = function(endpoints) {
  return new Collection(endpoints);
};
