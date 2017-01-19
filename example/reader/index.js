const flexiContainer = require('flexi-container');
const SocketContainer = require('flexi-container-socket');
const readerContract = require('./reader-contract');
const Reader = require('./reader');

flexiContainer.registerService(readerContract, new Reader(), new SocketContainer({serverPort: '8090'}));