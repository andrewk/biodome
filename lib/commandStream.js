import most from 'most';

export default function commandStream(eventBus) {
  return most.fromEvent('command', eventBus);
}
