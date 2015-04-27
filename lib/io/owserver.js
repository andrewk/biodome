import owjs from 'owjs';
import Promise from 'bluebird';
import env from 'envc';

env();

export default class OwserverIO {

  constructor(deviceAddress) {
    this.deviceAddress = deviceAddress;
    this.client = new owjs.Client({host: process.env.ONEWIRESERVER});
  }

  read() {
    return new Promise((resolve, reject) => {
      this.client.read(this.deviceAddress, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };

  write(value) {
    return new Promise((resolve, reject) => {
      this.client.write(self.deviceAddress, value, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };
}
