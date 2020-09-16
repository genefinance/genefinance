const rinkeby = require('./rinkeby');
const ropsten = require('./ropsten');
const test = require('./test');

module.exports = function (network) {
    switch (network) {
        case 'rinkeby':
            return rinkeby;
            case 'ropsten':
                return ropsten;
        case 'test':
            return test;
        default:
            throw new Error("Cannot found migration config of " + network);
    }
}