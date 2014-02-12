var chai = require("chai")
  , sinon = require("sinon")
  , expect = chai.expect
  , server = require('../../lib/server').factory

describe('connection', function() {
  before(function() {
    s = server();
  });

  after(function() {
    s.close();
  });

  it('refuses access without correct access token');
  it('confirms connection with correct access token');
});

describe('SSL connection', function() {
  before(function() {
    s = server();
  });

  after(function() {
    s.close();
  });

  it('provides an SSL certificate');
});

describe('client message received', function() {
  it('passes the event to its app');
});

describe('app events', function() {
  it('broadcasts sensor update');
  it('broadcasts device update');
});
