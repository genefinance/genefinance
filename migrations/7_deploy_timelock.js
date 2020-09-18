const Timelock = artifacts.require("Timelock");


//truffle migrate --network mainnet
//truffle migrate --network rinkeby

module.exports = async function (deployer, network, accounts) {

    // let config = require('./config')(network);

    let deployAccount = accounts[0];;

    await deployer.deploy(Timelock,
        deployAccount,
        2 * 24 * 3600,
        { from: deployAccount });
};

