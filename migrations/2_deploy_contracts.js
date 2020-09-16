const MvsToken = artifacts.require("MvsToken");
const DnaToken = artifacts.require("DnaToken");
const EtpToken = artifacts.require("EtpToken");
const MasterChef = artifacts.require("MasterChef");


//truffle migrate --network mainnet
//truffle migrate --network rinkeby

module.exports = async function (deployer, network, accounts) {

    let config = require('./config')(network);

    let deployAccount = accounts[0];;

    let _devaddr = deployAccount;
    let rewardPerBlock = config.rewardPerBlock;
    let startBlock = config.startBlock;
    let bonusEndBlock = config.bonusEndBlock;

    await deployer.deploy(MvsToken, { from: deployAccount });

    await deployer.deploy(DnaToken, "DNAChain Core Asset", "DNA", { from: deployAccount });

    await deployer.deploy(EtpToken, "Metaverse ETP Core Asset", "ETP", { from: deployAccount });

    await deployer.deploy(MasterChef,
        MvsToken.address,
        _devaddr,
        rewardPerBlock,
        startBlock,
        bonusEndBlock,
        { from: deployAccount });
};

