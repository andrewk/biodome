import http from 'http';
import https from 'https';
import ws from 'ws';

function getHttpServer(conf) {
  let server;
  if (conf.ssl) {
    server = https.Server(conf);
  } else {
    server = new http.Server();
  }

  return server;
}

export default class Server {
  constructor(config, requestHandler, socketConnectionHandler) {
    this.http = getHttpServer(config);
    this.http.on('request', requestHandler);
    this.http.listen(config.port, () => {
      this.ws = new ws.Server({server: this.http});
      this.ws.on('connection', socketConnectionHandler);
    });
  }

  broadcastToSockets(message) {
    this.ws.clients.forEach(client => client.send(message));
  }

  close() {
    this.http.close();
  }
}
