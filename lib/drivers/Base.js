export default class Base {
  constructor(io) {
    this.io = io;
  }

  read() {
    return this.io.read();
  }

  write(value) {
    return this.io.write(value);
  }
}
