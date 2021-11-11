
const MasterChef = artifacts.require("MasterChef");

const DnaToken = artifacts.require("DnaToken");
const EtpToken = artifacts.require("EtpToken");
const DlpToken = artifacts.require("DlpToken");
const MvsToken = artifacts.require("MvsToken");

module.exports = async function (deployer, network, accounts) {

    if (network == 'mvs') {
        //Is it OK?
        return;
    }

    let config = require('./config')(network);

    let instance = await MasterChef.deployed();

    let dnaToken = await DnaToken.deployed();
    let etpToken = await EtpToken.deployed();
    let dlpToken = await DlpToken.deployed();
    let mvsToken = await MvsToken.deployed();

    //DNA
    await instance.add(config.dnaTokenPoint, config.dnaLockEndBlock, config.rewardEndBlock, dnaToken.address, true, { from: accounts[0] });

    //ETP
    await instance.add(config.etpTokenPoint, config.etpLockEndBlock, config.rewardEndBlock, etpToken.address, true, { from: accounts[0] });

    //DLP
    await instance.add(config.dlpTokenPoint, config.dlpLockEndBlock, config.rewardEndBlock, dlpToken.address, true, { from: accounts[0] });

    //GENE
    await instance.add(config.mvsTokenPoint, config.mvsLockEndBlock, config.rewardEndBlock, mvsToken.address, true, { from: accounts[0] });

    //ZB
    for (let i = 0; i < config.tokenPools.length; i++) {
        await instance.add(config.tokenPools[i].point, config.tokenPools[i].lockEndBlock || 0, config.rewardEndBlock, config.tokenPools[i].address, true, { from: accounts[0] });
    }


}
