// Inverted boolean driver, flips 1 and 0
// Used to drive Normally Closed (NC) relays
// while retaining 1 = closed 0 = open logic

export default class Inverted {
  constructor(io) {
    this.io = io;
  }

  read() {
    return this.io.read().then((result) => result === 1 ? 0 : 1);
  }

  write(value) {
    return this.io.write(value === 1 ? 0 : 1);
  }
}
