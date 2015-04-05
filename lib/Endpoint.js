import log from './log';
import commandMatcherFactory from './commandMatcherFactory';

export default class Endpoint {
  constructor({
    id,
    type,
    driver,
    eventBus,
    commandMatcher,
    refreshRate,
    writeTimeout,
    readTimeout
  }) {
    super();

    this.id = id;

    // Free text
    this.type = type;

    // data is emitted on this event instance
    this.events = eventBus;

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

  broadcastData(value) {
    this.events.emit(
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

  subscribeToCommands(commands) {
    commands
      .filter(cmd => this.shouldExecuteCommand(cmd))
      .observe(cmd => this.executeCommand(cmd));
  }

  executeCommand(command) {
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

  toString() {
    return 'endpoint:' + this.id;
  }

  destroy() {
    if (this.refreshTimer) {
      global.clearInterval(this.refreshTimer);
    }
  }
}
