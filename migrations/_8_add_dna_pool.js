
const MasterChef = artifacts.require("MasterChef");

module.exports = async function (deployer, network, accounts) {
    let instance = await MasterChef.deployed();

    if (network == 'test') {
        //Is it OK?
        return;
    }

    let config = require('./config')(network);

    if (!config.dnaLpContract) {
        throw new Error("Please set the value of dnaLpContract");
    }

    await instance.add(config.dnaLpPoint, config.dnaLpContract, true, { from: accounts[0] });

}