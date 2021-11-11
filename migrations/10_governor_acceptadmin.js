
const GovernorAlpha = artifacts.require("GovernorAlpha");



//truffle migrate --network mainnet
//truffle migrate --network rinkeby

module.exports = async function (deployer, network, accounts) {

    let governor = await GovernorAlpha.deployed();

    let deployAccount = accounts[1];

    await governor.__acceptAdmin({ from: '0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b' });
};

