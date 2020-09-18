
const MasterChef = artifacts.require("MasterChef");

module.exports = async function (deployer, network, accounts) {
    let instance = await MasterChef.deployed();
    if (network == 'test') {
        //Is it OK?
        return;
    }

    let config = require('./config')(network);

    for (let i = 0; i < config.initPools.length; i++) {
        await instance.add(config.initPools[i].point, 0, config.initPools[i].address, true, { from: accounts[0] });
    }
}