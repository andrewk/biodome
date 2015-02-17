var Rx = require('rx');

var stream = new Rx.Subject(),
    logTypes = ['debug', 'info', 'warning', 'error'],
    logger = {};

logTypes.forEach(function(logType) {
  //  expected format for errorInfo param
  //  {
  //    source: 'endpoint:__ID__',
  //    message: DESCRIPTION,
  //    data: OBJECT
  //  }
  logger[logType] = function(errorInfo) {
    let data = {};
    if (typeof errorInfo === 'string') {
      data.message = errorInfo;
    } else {
      data = error;
    }
    data.type = logType;
    stream.onNext(data);
  };

  logger[logType + 'Stream'] = function() {
    return stream.filter(d =>  d.type === logType);
  };
});

module.exports = logger;
