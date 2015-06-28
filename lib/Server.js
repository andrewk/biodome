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
    });
  }

  registerSocketClient(client) {
    client.on('message', msg => {
      const validation = validateCommand(msg);

      if (validation.valid) {
        this.events.emit(msg.type, msg.data);
      } else {
        // TODO send validation error to client
      }
    });
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
