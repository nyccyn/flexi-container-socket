const fs = require('fs');

class Reader {
    read() {
        const readerStream = fs.createReadStream('input.txt');
        readerStream.setEncoding('UTF8');
        readerStream.on('data', chunk => this.onData(chunk));
        readerStream.on('end', () => this.onEnd());
    }
}

module.exports = Reader;