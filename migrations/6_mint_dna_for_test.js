const DnaToken = artifacts.require("DnaToken");

module.exports = async function (deployer, network, accounts) {
    if (network == 'mainnet') {
        console.log('will not mint for test in mainnet');
        return;
    }

    let dnaTokenIns = await DnaToken.deployed();

    console.log("dnaToken address:" + dnaTokenIns.address);

    await dnaTokenIns.deliver(accounts[0], '1000000000000', 'test', 'test', { from: accounts[0] })
}