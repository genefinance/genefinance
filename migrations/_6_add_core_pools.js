
const MasterChef = artifacts.require("MasterChef");

module.exports = async function (deployer, network, accounts) {
    let instance = await MasterChef.deployed();

    if (network == 'test') {
        //Is it OK?
        return;
    }

    let config = require('./config')(network);

    if (!config.coreLpContract) {
        throw new Error("Please set the value of coreLpContract");
    }

    await instance.add(config.coreLpPoint, config.coreLpContract, true, { from: accounts[0] });

}