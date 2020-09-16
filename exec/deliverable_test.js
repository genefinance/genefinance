var dnaToken = artifacts.require("DnaToken");
var etpToken = artifacts.require("EtpToken");

var dnaTokenAddress = '0x34B0cEaC994fe9eb3B4f62FBCb78a171D0d1232b';
var eptTokenAddress = '0x7897E69D826eB53e7a3C7373aD2D4290f9ff2466';

var from = "0xEa15bd096c5331C5a1392b69dE3F1D8983d5dB7b";

//truffle exec ./exec/deliverable_test.js --network ropsten
module.exports = function () {
    async function doDeliverable() {
        let dnaTokenContract = await dnaToken.at(dnaTokenAddress);
        let etpTokenContract = await etpToken.at(eptTokenAddress);

        let dnaAmount = 1000000;

        await dnaTokenContract.deliver(from, dnaAmount, 'test', 'test', { from: from })
        await dnaTokenContract.collect(dnaAmount, 'myetpaddress', { from: from })

        let etpAmount = 10000000000;

        await etpTokenContract.deliver(from, etpAmount, 'test', 'test', { from: from })
        await etpTokenContract.collect(etpAmount, 'myetpaddress', { from: from })

        return true;
    }

    doDeliverable().then(console.log).catch(console.log);
}