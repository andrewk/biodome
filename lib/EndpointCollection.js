import most from 'most';
import Endpoint from './Endpoint';

const endpoints = [];

export default class EndpointCollection {
  constructor(events) {
    this.events = events;
  }

  setEndpoints(endpointArray) {
    endpointArray.forEach((ep) => {
      if (!(ep instanceof Endpoint)) {
        throw new TypeError('Invalid object supplied to EndpointCollection');
      }

      ep.events = this.events;
      ep.subscribeToCommands(this.commands());
      endpoints.push(ep);
    });
  }

  commands() {
    return most.fromEvent('commands', this.events);
  }

  data() {
    return most.fromEvent('data', this.events);
  }

  id(id) {
    return this.data()
      .filter((d) => d.id === id);
  };

  type(type) {
    return this.data()
      .filter((d) => d.type === type);
  };
}
