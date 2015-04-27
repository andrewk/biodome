import fs from 'graceful-fs';
import Promise from 'bluebird';

export default class File {
  constructor(path) {
    this.path = path;
  }

  read() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.path, {encoding: 'utf-8'}, (err, result) => {
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
      fs.writeFile(this.path, value, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      });
    });
  };
}
