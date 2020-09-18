var dnaToken = artifacts.require("DnaToken");
var etpToken = artifacts.require("EtpToken");
var web3 = require('web3');

var dnaTokenAddress = '0xde372f91Ab046F8212a3F2c73F3EFee3edDfd794';
var eptTokenAddress = '0x05d7a65017448c6ddD7f2119A776661Ffb79cf98';

var from = "0xEa15bd096c5331C5a1392b69dE3F1D8983d5dB7b";


//truffle exec ./exec/mint_dna_etp_for_test.js --network ropsten
module.exports = function () {
    async function doMint() {
        let dnaTokenContract = await dnaToken.at(dnaTokenAddress);
        let etpTokenContract = await etpToken.at(eptTokenAddress);

        await dnaTokenContract.deliver(from, '1000000000000', 'init-for-test', 'init-for-test', { from: from })

        await etpTokenContract.deliver(from, '10000000000000000', 'init-for-test', 'init-for-test', { from: from })

        return true;
    }

    doMint().then(console.log).catch(console.log);
}