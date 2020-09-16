const DnaToken = artifacts.require("DnaToken");
const EtpToken = artifacts.require("EtpToken");

module.exports = async function (deployer, network, accounts) {
    if (network == 'mainnet') {
        console.log('will not mint for test in mainnet');
        return;
    }

    let dnaTokenIns = await DnaToken.deployed();

    await dnaTokenIns.deliver(accounts[0], '1000000000000', 'test-init', 'test-init', { from: accounts[0] })


    let etpTokenIns = await EtpToken.deployed();
    await etpTokenIns.deliver(accounts[0], '10000000000000000', 'test-init', 'test-init', { from: accounts[0] })
}