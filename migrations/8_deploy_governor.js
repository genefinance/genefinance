const Timelock = artifacts.require("Timelock");
const GovernorAlpha = artifacts.require("GovernorAlpha");
const MvsToken = artifacts.require("MvsToken");



//truffle migrate --network mainnet
//truffle migrate --network rinkeby

module.exports = async function (deployer, network, accounts) {

    // let config = require('./config')(network);

    let mvsToken = await MvsToken.deployed();
    let timelock = await Timelock.deployed();

    let deployAccount = accounts[0];

    await deployer.deploy(GovernorAlpha,
        timelock.address,
        mvsToken.address,
        deployAccount,
        { from: deployAccount });
};

