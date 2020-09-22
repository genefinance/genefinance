var DnaToken = artifacts.require("DnaToken");
var EtpToken = artifacts.require("EtpToken");
var web3 = require('web3');


var from = "0xEa15bd096c5331C5a1392b69dE3F1D8983d5dB7b";


//truffle exec ./exec/test/mint_dna_etp_for_test.js --network ropsten
module.exports = function () {
    async function doMint() {
        let dnaTokenContract = await DnaToken.deployed();
        let etpTokenContract = await EtpToken.deployed();

        await dnaTokenContract.deliver(from, '1000000000000', 'init-for-test', 'init-for-test', { from: from })

        await etpTokenContract.deliver(from, '10000000000000000', 'init-for-test', 'init-for-test', { from: from })

        return true;
    }

    doMint().then(console.log).catch(console.log);
}