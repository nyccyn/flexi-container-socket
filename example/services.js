const flexiContainer = require('flexi-container');
const SocketContainer = require('flexi-container-socket');
const readerContract = require('./reader/reader-contract');

const reader = flexiContainer.getService(readerContract, new SocketContainer({remoteUrl: 'http://localhost:8090'}));

module.exports = {
    reader
}