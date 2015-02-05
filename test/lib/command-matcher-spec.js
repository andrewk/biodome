var chai = require('chai'),
  expect = chai.expect,
  matcher = require('../../lib/command-matcher');

describe('Command Matcher', function() {
  it('matches on ID', function() {
    var ep = { 'id' : 'foo' };
    var command = { 
      'selector' : {'id': 'foo'}
    };
    
    expect(matcher(ep)(command)).to.be.true;
  });

  it('rejects on ID', function() {
    var ep = { 'id' : 'foo' };
    var command = { 
      'selector' : {'id': 'qux'}
    };
    
    expect(matcher(ep)(command)).to.be.false;
  });

  it('matches on type', function() {
    var ep = { 'type' : 'foo' };
    var command = { 
      'selector' : {'type': 'foo'}
    };
    
    expect(matcher(ep)(command)).to.be.true;
  });

  it('rejects on type', function() {
    var ep = { 'type' : 'foo' };
    var command = { 
      'selector' : {'type': 'qux'}
    };
    
    expect(matcher(ep)(command)).to.be.false;
  });
});
