import http from 'http';
import https from 'https';
import ws from 'ws';
import validateCommand from './validateCommand';

export default class Server {
  constructor({ssl, events, port, keys}) {
    this.http = (ssl)
      ? https.Server(keys)
      : http.Server();

    this.events = events;

    this.http.on('request', (req, res) => this.requestHandler(req, res));
    this.http.listen(port, () => {
      this.ws = new ws.Server({server: this.http});
      this.ws.on('connection', client => this.registerSocketClient(client));
      this.events.emit('server.open');
    });
  }

  registerSocketClient(client) {
    client.on('message', msg => {
      try {
        msg = JSON.parse(msg)
      } catch(e) {
        // TODO send error to client
        console.error('Invalid message: Could not parse JSON');
        return;
      }

      if (msg.type === 'command') {
        this.emitCommand(msg.data, client);
      } else if (msg.type === 'data') {
        this.events.emit('data', msg.data);
      } else {
        // TODO send error to client
        console.error(`Unknown socket message received: ${msg}`);
      }
    });
  }

  emitCommand(command, client) {
    const validation = validateCommand(command);
    if (validation.valid) {
      this.events.emit('command', command);
    } else {
      // TODO send validation error to client
      console.error(validation.error);
    }
  }

  requestHandler(req, res) {
    res.end(404);
  };

  broadcastData(dataStream) {
    dataStream.observe(x => {
      this.broadcastMessage({
        type: 'data',
        data: x
      })
    });
  }

  broadcastCommands(commandStream) {
    commandStream.observe(x => {
      this.broadcastMessage({
        type: 'command',
        data: x
      })
    });
  }

  broadcastMessage(message) {
    this.ws.clients.forEach(client => client.send(message));
  }

  close() {
    this.http.close();
  }
}
