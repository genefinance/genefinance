const rinkeby = require('./rinkeby');
const ropsten = require('./ropsten');
const mainnet = require('./mainnet');
const mvs = require('./mvs');

module.exports = function (network) {
    switch (network) {
        case 'rinkeby':
            return rinkeby;
        case 'ropsten':
            return ropsten;
        case 'mainnet':
            return mainnet;
        case 'mvs':
            return mvs;
        default:
            throw new Error("Cannot found migration config of " + network);
    }
}
