# Welcome

Basic TCP server and client written in JS / Node. There are no dependencies.

This was written to just play around with the net TCP functions of Node native, nothing more.

### Node native modules use:
- net
- readline

### Features
* Server
  * Configurable MOTD broadcasted on joining
  * Keeps a running list of connected clients
  * Public messages are broadcast to all connected clients
  * Every 3 seconds we play a game of ping pong where the server sends 'ping' and all clients respond with 'pong'
  * Several different types of messages classes:
    * Server, PingPong, Private, Public
  * Support for up to 999 characters per message
    * Longer messages are broadcast but truncated down with '...' appended
  * Messaging format is easily expandable:
    * Each payload consists of an array of messages
    * Each member of the array is formatted as [LEN][STR]
      * LEN is the length of the string in front of it
    * Each payload is prepended with the message type in the above format
    * Example payload: 007.SRVMSG012Hello, World015Another message
* Client
  * On disconnect automatically reconnect in 3 seconds
  * All public messages are prepended with '> Room: '
