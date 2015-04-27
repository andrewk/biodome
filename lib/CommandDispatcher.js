export default class CommandDispatcher {
  constructor(events) {
    this.events = events;
  }

  on(id) {
    this.dispatch({id, value: 1});
  }

  off(id) {
    this.dispatch({id, value: 0});
  }

  dispatch(cmd) {
    const mode = cmd.value === undefined ? 'read' : 'write';
    const selector = cmd.id ? {id: cmd.id} : {type: cmd.type};
    this.events.emit(
      'command',
      {
        selector,
        instruction: {type: mode, value: cmd.value}
      }
    );
  }
}
