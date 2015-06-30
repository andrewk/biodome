import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import ws from 'ws';
import EventEmitter from 'eventemitter3';
import Server from '../../lib/Server';

describe('Server', function() {
  describe('connection', function() {
    it('refuses access without correct access token');
    it('confirms connection with correct access token');
  });

  describe('Correct handlers are used', function() {
    var requestSpy, socketSpy, srv;

    beforeEach(function() {
      requestSpy = sinon.spy();
      socketSpy = sinon.spy();

      var requestHandler = function(req, res) {
        requestSpy();
        res.end('200');
      };

      srv = new Server({'port': 6676, events: new EventEmitter});
      srv.registerSocketClient = socketSpy;
      srv.requestHandler = requestHandler;
    });

    it('uses composed request handler', function(done) {
      request(srv.http).
        post('/test').
        send().
        end(function(err, res) {
          expect(requestSpy.called).to.be.true;
          srv.close();
          done();
        });
    });

    it('registers socket client', function(done) {
      var client = new ws('ws://localhost:6676');
      client.on('open', function() {
        expect(socketSpy.called).to.be.true;
        srv.close();
        done();
      });
    });
  });

});
