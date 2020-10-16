const MvsToken = artifacts.require("MvsToken");
const MasterChef = artifacts.require("MasterChef");


//truffle migrate --network mainnet
//truffle migrate --network rinkeby

module.exports = async function (deployer, network, accounts) {

    let config = require('./config')(network);

    let deployAccount = accounts[0];;

    let _devaddr = deployAccount;
    let rewardPerBlock = config.rewardPerBlock;
    let startBlock = config.startBlock;
    let bonusStartBlock = config.bonusStartBlock;
    let bonusEndBlock = config.bonusEndBlock;

    await deployer.deploy(MasterChef,
        MvsToken.address,
        _devaddr,
        rewardPerBlock,
        startBlock,
        bonusStartBlock,
        bonusEndBlock,
        { from: deployAccount });
};

