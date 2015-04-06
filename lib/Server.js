import http from 'http';
import https from 'https';
import ws from 'ws';

function getHttpServer(conf) {
  if (conf.ssl) {
    return new https.Server(conf);
  } else {
    return new http.Server();
  }
};

export default class Server {
  constructor(config, requestHandler, socketConnectionHandler) {
    this.http = getHttpServer(config);
    this.http.on('request', requestHandler);
    this.http.listen(config.port, () => {
      this.ws = new ws.Server({'server': this.http});
      this.ws.on('connection', socketConnectionHandler)
    });
  }

  broadcastToSockets(message) {
    this.ws.clients.forEach(client => client.send(message));
  }

  close() {
    this.http.close();
  }
}
