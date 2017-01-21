# flexi-container-socket
Socket.io plugin for [flexi-container](https://github.com/nyccyn/flexi-container)

## Installion
`npm install --save flexi-container-socket`

## Usage
Firts thing we need to create a `Contract` for our service that the service will implement and the consumer will use:
```javascript
// reader-contract.js
const Contract = require('flexi-container').Contract;

module.exports = new Contract({
    read: Contract.Function,
    onData: Contract.Event,
    onEnd: Contract.Event,
});
```

Contract's members can be either `Contract.Function` or `Contract.Event`. 
When members is a `Contract.Event`, the method will be exposed to the concrete class.

our service just implement a class with the same members
```javascript
// reader.js
const fs = require('fs');
class Reader {
    read() {
        const readerStream = fs.createReadStream('input.txt');
        readerStream.setEncoding('UTF8');
        readerStream.on('data', chunk => this.onData(chunk));
        readerStream.on('end', () => this.onEnd());
    }
}
```


to register the service in the container we'll call `registerService(contract, implementation, [plugin])` and to use the service a call `getService(contract, [plugin])`
```javascript
// reader service registration
const flexiContainer = require('flexi-container');
const SocketContainer = require('flexi-container-socket');
const readerContract = require('./reader-contract');
const Reader = require('./reader');

flexiContainer.registerService(readerContract, new Reader(), new SocketContainer({serverPort: '8090'}));
```
```javascript
// service consumer
const flexiContainer = require('flexi-container');
const SocketContainer = require('flexi-container-socket');
const readerContract = require('./reader/reader-contract');

const reader = flexiContainer.getService(readerContract, new SocketContainer({remoteUrl: 'http://localhost:8090'}));

reader.onData(data => console.log(data));
reader.read();
```

## API
flexi-container-socket API is equivalent to [socket.io](https://github.com/socketio/socket.io) and [socket.io-client](https://github.com/socketio/socket.io-client) libraries' APIs.
`new SocketContainer([props])`
The following properties are supported:
* `serverPort` - Port that server will listen to
* `remoteUrl` - The remove service url
* `serverOpts` - Options equivalent to [socket.io](https://github.com/socketio/socket.io)
* `clientOpts` - Options equivalent to [socket.io-client](https://github.com/socketio/socket.io-client)
