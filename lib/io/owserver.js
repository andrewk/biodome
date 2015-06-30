import owjs from 'owjs';

export default class OwserverIO {
  constructor(deviceAddress, owsAddress) {
    this.deviceAddress = deviceAddress;
    this.client = new owjs.Client({host: owsAddress});
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
