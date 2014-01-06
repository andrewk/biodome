module.exports = function Stateful() {
  this.state = null;
  this.updatedAt = null;
  this.validStates = [];

  this.isState = function(state) {
    return this.state == state;
  };

  this.setState = function(newState) {
    if (this.state == newState) return;
    this.state = newState;
    this.updatedAt = this.timestamp();
    this.stateChanged(); // must implement this
  };

  this.timestamp = function() {
    return Math.round(Date.now() / 1000);
  };
};
