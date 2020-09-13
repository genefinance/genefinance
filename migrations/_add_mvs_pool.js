
const MasterChef = artifacts.require("MasterChef");

module.exports = async function (deployer, network, accounts) {
    let instance = await MasterChef.deployed();

    if (network == 'test') {
        //Is it OK?
        return;
    }

    let config = require('./config')(network);

    if (!config.mvsLpContract) {
        throw new Error("Please set the value of mvsLpContract");
    }

    await instance.add(config.mvsLpPoint, config.mvsLpContract, true, { from: accounts[0] });

}