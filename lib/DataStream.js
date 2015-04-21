import most from 'most';

export default class DataStream {
  constructor(events) {
    this.events = events;
  }

  stream() {
    return most.fromEvent('data', this.events);
  }

  id(id) {
    return this.stream()
      .filter((d) => d.id === id);
  };

  type(type) {
    return this.stream()
      .filter((d) => d.type === type);
  };
}
