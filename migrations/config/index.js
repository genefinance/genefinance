const rinkeby = require('./rinkeby');
const test = require('./test');

module.exports = function (network) {
    switch (network) {
        case 'rinkeby':
            return rinkeby;
        case 'test':
            return test;
        default:
            throw new Error("Cannot found migration config of " + network);
    }
}