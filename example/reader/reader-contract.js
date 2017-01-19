const Contract = require('flexi-container').Contract;

module.exports = new Contract({
    read: Contract.Function,
    onData: Contract.Event,
    onEnd: Contract.Event,
});

