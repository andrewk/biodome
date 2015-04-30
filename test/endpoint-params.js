import EventEmitter from 'eventemitter3';
import BaseDriver from '../lib/drivers/base';

function alwaysTrue(x) {
  return true;
}

export default function params(base={}) {
  base.id = base.id || 123;
  base.type = base.type || 'sensor';
  base.events = base.events || new EventEmitter();
  base.commandMatcher = base.commandMatcher || alwaysTrue;
  base.driver = new BaseDriver({
    'read': () => Promise.resolve(1),
    'write': (val) => Promise.resolve(val)
  });
  return base;
}
