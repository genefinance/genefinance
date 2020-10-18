
const GovernorAlpha = artifacts.require("GovernorAlpha");



//truffle migrate --network mainnet
//truffle migrate --network rinkeby

module.exports = async function (deployer, network, accounts) {

    let governor = await GovernorAlpha.deployed();

    let deployAccount = accounts[0];

    await governor.__acceptAdmin({ from: deployAccount });
};

