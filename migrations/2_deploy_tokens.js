const MvsToken = artifacts.require("MvsToken");
const DnaToken = artifacts.require("DnaToken");
const EtpToken = artifacts.require("EtpToken");


//truffle migrate --network mainnet
//truffle migrate --network rinkeby

module.exports = async function (deployer, network, accounts) {

    let deployAccount = accounts[0];;

    await deployer.deploy(MvsToken, { from: deployAccount });

    await deployer.deploy(DnaToken, "DNAChain Core Asset", "DNA", { from: deployAccount });

    await deployer.deploy(EtpToken, "Metaverse ETP Core Asset", "ETP", { from: deployAccount });

};

