const MvsToken = artifacts.require("MvsToken");
const UniswapV2Factory = artifacts.require("UniswapV2Factory");


module.exports = async function (deployer, network, accounts) {

    if (network == 'test') {
        //Is it OK?
        return;
    }

    let config = require('./config')(network);


    let factory = await UniswapV2Factory.at(config.factoryContract);
    let mvsTokenIns = await MvsToken.deployed();

    await factory.createPair(config.wethContract, mvsTokenIns.address, { from: accounts[0] })
}