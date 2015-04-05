import Kefir from 'kefir';

export default function commandStream(eventBus) {
  return Kefir.fromEvent(eventBus, 'command');
}
