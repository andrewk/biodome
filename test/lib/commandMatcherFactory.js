import chai from 'chai';
import commandMatcherFactory from '../../lib/commandMatcherFactory';
const expect = chai.expect;

describe('Command commandMatcherFactory', function() {
  it('matches on ID', function() {
    var ep = { 'id' : 'foo' };
    var command = {
      'selector' : {'id': 'foo'}
    };

    expect(commandMatcherFactory(ep)(command)).to.be.true;
  });

  it('rejects on ID', function() {
    var ep = { 'id' : 'foo' };
    var command = {
      'selector' : {'id': 'qux'}
    };

    expect(commandMatcherFactory(ep)(command)).to.be.false;
  });

  it('matches on type', function() {
    var ep = { 'type' : 'foo' };
    var command = {
      'selector' : {'type': 'foo'}
    };

    expect(commandMatcherFactory(ep)(command)).to.be.true;
  });

  it('rejects on type', function() {
    var ep = { 'type' : 'foo' };
    var command = {
      'selector' : {'type': 'qux'}
    };

    expect(commandMatcherFactory(ep)(command)).to.be.false;
  });
});
