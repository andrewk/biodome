export default function socketHandler(dataStream, commandIntentStream) {
  return function (client) {
    client.on('message', function (message) {
      if (!message) {
        client.send(JSON.stringify({type: 'error', message: 'Invalid message'}));
      }
    });
  };
}
