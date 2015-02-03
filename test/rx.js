var Rx = require('rx'),
  assert = require('chai').assert;

function createMessage(actual, expected) {
  return 'Expected: [' + expected.toString() + ']\r\nActual: [' + actual.toString() + ']';
}

function assertEqual(expected, actual) {
  var comparer = Rx.internals.isEqual,
  isOk = true;

  if (expected.length !== actual.length) {
    assert(false, 'Not equal length. Expected: ' + expected.length + ' Actual: ' + actual.length);
    return;
  }

  for(var i = 0, len = expected.length; i < len; i++) {
    isOk = comparer(expected[i], actual[i]);
    if (!isOk) {
      break;
    }
  }

  assert(isOk, createMessage(expected, actual));
}

module.exports = {
  onNext: Rx.ReactiveTest.onNext,
  onCompleted: Rx.ReactiveTest.onCompleted,
  subscribe: Rx.ReactiveTest.subscribe,
  assert: assertEqual
};
