const Timelock = artifacts.require("Timelock");
const GovernorAlpha = artifacts.require("GovernorAlpha");



//truffle migrate --network mainnet
//truffle migrate --network rinkeby

module.exports = async function (deployer, network, accounts) {

    // let config = require('./config')(network);

    let timelock = await Timelock.deployed();
    let governor = await GovernorAlpha.deployed();

    let deployAccount = accounts[0];

    await timelock.setPendingAdmin(governor.address, { from: deployAccount });
};

