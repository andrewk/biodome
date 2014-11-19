SERVER
------

  - Websocket remains as broadcast-only for informing all clients of updates
  - "Heart beat" read and broadcast endpoint status at configurable interval to all clients
  - "Restart" signal from server to all clients; instructs to disable and reconnect in N seconds
  - SECURITY. JWT for client. Optional HSTS header?

CLIENT
------

  - Rewrite client to match above server changes
  - Least fragile method of mocking server for client specs?
  - Reconnection strategy, including honoring server restart signal
  - JWT support

OTHER
-----

  - Replace or rewrite GPIO driver because it blows.
