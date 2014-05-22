var chai = require('chai')
  , chaiPromise = require('chai-as-promised')
  , sinon = require('sinon')
  , expect = chai.expect
  , App = require('../../lib/app')
  , endpoint = require('../blueprints/endpoint');

chai.use(chaiPromise);

describe('App', function() {
  describe('#endpointsWhere', function() {
    it('returns endpoints matching property=value', function() {
      var app = App.new();
      app.endpoints.push(endpoint.make({'type' : 'foo'}));
      app.endpoints.push(endpoint.make({'type' : 'bar'}));
      app.endpoints.push(endpoint.make({'type' : 'bar'}));
      var endpoints = app.endpointsWhere({'type': 'bar'});
      expect(endpoints.length).to.equal(2);
      endpoints.map(function(ep) {
        expect(ep.type).to.equal('bar');
      });
    });

    it('returns null for unrecognized id', function() {
      var app = App.new();
      expect(app.endpoint('does_not_exist')).to.be.null;
    });
  });

  describe('#endpoint', function() {
    it('returns single endpoint by properties obj', function() {
      var app = App.new();
      var s = endpoint.make();
      app.endpoints.push(s);

      expect(app.endpoint({'id': s.id})).to.equal(s);
    });

    it('returns null for unrecognized id', function() {
      var app = App.new();
      expect(app.endpoint({'id': 'does_not_exist'})).to.be.null;
    });
  });

  describe('#executeInstruction', function() {
    it('executes an instruction on a single endpoint', function() {
      var app = App.new();
      app.endpoints.push(endpoint.make({'type' : 'foo'}));
      app.endpoints.push(endpoint.make({'type' : 'bar'}));
      var instruction = { 
        'selector' : {'type':'foo'},
        'command' : {'type': 'read', 'value' : null}
      };
      return expect(app.executeInstruction(instruction)).to.be.fulfilled
        .then(function(result) {
          expect(result).to.deep.equal(
            app.endpointsWhere(instruction.selector).map(function(ep) {
              return ep.toJSON();
            })
          );
        });
    });

   it('executes an instruction on multiple endpoints', function() {
      var app = App.new();
      app.endpoints.push(endpoint.make({'type' : 'foo'}));
      app.endpoints.push(endpoint.make({'type' : 'foo'}));
      app.endpoints.push(endpoint.make({'type' : 'foo'}));
      app.endpoints.push(endpoint.make({'type' : 'bar'}));
      var instruction = { 
        'selector' : {'type':'foo'},
        'command' : {'type': 'read', 'value' : null}
      };
      return expect(app.executeInstruction(instruction)).to.be.fulfilled
        .then(function(result) {
          expect(result.length).to.equal(3);
          expect(result).to.deep.equal(
            app.endpointsWhere(instruction.selector).map(function(ep) {
              return ep.toJSON();
            })
          );
        });
    });

    it('returns a rejected promise when given an invalid instruction', function() {
      var app = App.new();
      app.endpoints.push(endpoint.make({'type' : 'foo'}));
      var instruction = { 
        'selector' : {'type':'foo'},
        'command' : {}
      };

      return expect(app.executeInstruction(instruction)).to.be.rejected
        .then(function(e) {
          expect(e.toString()).to.equal('Error: Invalid instruction: Invalid command');
        });
    });
  });
});
