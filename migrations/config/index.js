const rinkeby = require('./rinkeby');
const ropsten = require('./ropsten');
const mainnet = require('./mainnet');
const test = require('./test');

module.exports = function (network) {
    switch (network) {
        case 'rinkeby':
            return rinkeby;
        case 'ropsten':
            return ropsten;
        case 'mainnet':
            return mainnet;
        case 'test':
            return test;
        default:
            throw new Error("Cannot found migration config of " + network);
    }
}