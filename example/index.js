const services = require('./services');

services.reader.onData(data => console.log(data));
services.reader.read();