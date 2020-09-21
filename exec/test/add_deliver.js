var dnaToken = artifacts.require("DnaToken");
var etpToken = artifacts.require("EtpToken");
var web3 = require('web3');

var dnaTokenAddress = '0x34B0cEaC994fe9eb3B4f62FBCb78a171D0d1232b';
var eptTokenAddress = '0x7897E69D826eB53e7a3C7373aD2D4290f9ff2466';

var from = "0xEa15bd096c5331C5a1392b69dE3F1D8983d5dB7b";

//@211
var deliver = "0x9406ff509d0c9bcbe9d7bdde6cd22cb2f547824d";

//truffle exec ./exec/test/add_deliver.js --network ropsten
module.exports = function () {
    async function doDeliverable() {
        let dnaTokenContract = await dnaToken.at(dnaTokenAddress);
        let etpTokenContract = await etpToken.at(eptTokenAddress);

        let DELIVER_ROLE = web3.utils.soliditySha3('DELIVER_ROLE');
        let MINTER_ROLE = web3.utils.soliditySha3('MINTER_ROLE');

        await dnaTokenContract.grantRole(DELIVER_ROLE, deliver, { from: from })
        await dnaTokenContract.grantRole(MINTER_ROLE, deliver, { from: from })

        await etpTokenContract.grantRole(DELIVER_ROLE, deliver, { from: from })
        await etpTokenContract.grantRole(MINTER_ROLE, deliver, { from: from })



        return true;
    }

    doDeliverable().then(console.log).catch(console.log);
}