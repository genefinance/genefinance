const MvsToken = artifacts.require("MvsToken");
const DnaToken = artifacts.require("DnaToken");
const EtpToken = artifacts.require("EtpToken");
const DlpToken = artifacts.require("DlpToken");


//truffle migrate --network mainnet
//truffle migrate --network rinkeby
//truffle migrate -f 2 --to 2 --network ropsten

module.exports = async function (deployer, network, accounts) {

    let deployAccount = accounts[0];;

    await deployer.deploy(MvsToken, { from: deployAccount });

    await deployer.deploy(DnaToken, "Metaverse DNA Chain Token", "DNA", { from: deployAccount });

    await deployer.deploy(EtpToken, "Metaverse ETP Chain Token", "ETP", { from: deployAccount });

    await deployer.deploy(DlpToken, "DLP Token", "DLP", { from: deployAccount });

};

