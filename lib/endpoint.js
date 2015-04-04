import Rx from 'rx';
import EventEmitter from 'eventemitter3';
import log from './log';
import commandMatcherFactory from './command-matcher';

export default class Endpoint extends EventEmitter {
  constructor({
    id,
    type,
    driver,
    commandMatcher,
    refreshRate,
    writeTimeout,
    readTimeout
  }) {
    super();

    this.id = id;

    // Free text
    this.type = type;

    // must implement biodome.driver interface
    this.driver = driver;

    this.shouldExecuteCommand = commandMatcher || commandMatcherFactory(this);

    // refresh rate in ms (optional)
    this.refreshRate = refreshRate;

    // maximum ms allowed for write attempt
    this.writeTimeout = writeTimeout || 2000;

    // maximum ms allowed for read attempt
    this.readTimeout = readTimeout || 1000;

    if (this.refreshRate) {
      this.refreshTimer = global.setInterval(
        () => {
          this.read();
        },
        this.refreshRate
      );
    }
  }

  subscribeToCommands(commands) {
    if (this.commandSubscription) {
      this.commandSubscription.dispose();
    }

    this.commandSubscription = commands.subscribe(this.createCommandObserver());
  }

  broadcastData(value) {
    this.emit(
      'data',
      {
        'id': this.id,
        'type': this.type,
        'timestamp': Date.now(),
        'value': value
      }
    );
  }

  write(value) {
    return new Promise((resolve, reject) => {
      setTimeout(
        () => {
          reject(new Error('Exceeded maximum write execution time'));
        },
        this.writeTimeout
      );

      this.driver.write(value).
        then(newValue => {
          this.broadcastData(newValue);
          resolve(newValue);
        }).
        catch(e => {
          log.error({
            'source': this.toString(),
            'message': 'Write failed',
            'data': value
          });
          reject(new Error('Hardware failure'));
        });
    });
  }

  read() {
    return new Promise((resolve, reject) => {
      setTimeout(
        () => {
          reject(new Error('Exceeded maximum read execution time'));
        },
        this.readTimeout
      );

      this.driver.read().
        then(newValue => {
          this.broadcastData(newValue);
          resolve(newValue);
        }).
        catch(e => {
          log.error({
            'source':  this.toString(),
            'message': 'Read failed',
            'data': null
          });
          reject(new Error('Hardware failure'));
        });
    });
  }

  createCommandObserver() {
    return Rx.Observer.create(
      (command) => {
        if (!this.shouldExecuteCommand(command)) {
          return;
        }

        if (command.instruction.type === 'write') {
          this.write(command.instruction.value).
            catch(e => {
              log.error({
                'source':  'command:' + this,
                'message': 'Command failed: ' + e.message,
                'data': command
              });
            });
        } else if (command.instruction.type === 'read') {
          this.read().
            catch(e => {
              log.error({
                'source':  'command:' + this,
                'message': 'Command failed: ' + e.message,
                'data': command
              });
            });
        }
      }
    );
  }

  toString() {
    return 'endpoint:' + this.id;
  }

  destroy() {
    if (this.refreshTimer) {
      global.clearInterval(this.refreshTimer);
    }

    if (this.commandSubscription) {
      this.commandSubscription.dispose();
    }
  }
}
