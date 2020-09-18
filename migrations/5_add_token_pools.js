
const MasterChef = artifacts.require("MasterChef");

const DnaToken = artifacts.require("DnaToken");
const EtpToken = artifacts.require("EtpToken");

module.exports = async function (deployer, network, accounts) {

    if (network == 'test') {
        //Is it OK?
        return;
    }

    let config = require('./config')(network);

    let instance = await MasterChef.deployed();

    let dnaToken = await DnaToken.deployed();
    let etpToken = await EtpToken.deployed();

    await instance.add(config.dnaTokenPoint, config.dnaLockEndBlock, config.rewardEndBlock, dnaToken.address, true, { from: accounts[0] });

    await instance.add(config.etpTokenPoint, config.etpLockEndBlock, config.rewardEndBlock, etpToken.address, true, { from: accounts[0] });

}