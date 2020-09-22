
const UniswapV2Factory = artifacts.require("UniswapV2Factory");

const MasterChef = artifacts.require("MasterChef");
const MvsToken = artifacts.require("MvsToken");


//truffle exec ./exec/prod/1_create_mvs_pair_and_pool.js --network ropsten
module.exports = function () {
    let network = process.argv[process.argv.length - 1]
    let config = require('../../migrations/config')(network);

    async function doCreate() {

        let masterChefIns = await MasterChef.deployed();
        let mvsTokenIns = await MvsToken.deployed();

        console.log("masterChefIns:" + masterChefIns.address);
        console.log("mvsTokenIns:" + mvsTokenIns.address);

        let mvsTokenContract = mvsTokenIns.address;//config.mvsTokenContract;
        let masterChefContract = masterChefIns.address//config.masterChefContract;

        let wethTokenContract = config.wethContract;
        let mvsLpContract = config.mvsLpContract;
        let mvsLpPoint = config.mvsLpPoint;
        let rewardEndBlock = config.rewardEndBlock;
        if (!mvsTokenContract) {
            throw new Error("mvsTokenContract can not be empty")
        }
        if (!wethTokenContract) {
            throw new Error("wethTokenContract can not be empty")
        }

        if (!masterChefContract) {
            throw new Error("masterChefContract can not be empty")
        }
        if (!mvsLpContract) {
            let factory = await UniswapV2Factory.at(config.factoryContract);
            let createResult = await factory.createPair(wethTokenContract, mvsTokenContract, { from: config.deployAccount });
            //console.log("createResult");
            //console.log(JSON.stringify(createResult))
            mvsLpContract = createResult.receipt.logs[0].args.pair;
        }
        if (!mvsLpContract) {
            throw new Error("mvsLpContract can not be empty")
        }
        console.log('mvsLpContract:' + mvsLpContract);

        let masterChef = await MasterChef.at(masterChefContract);

        let addResult = await masterChef.add(mvsLpPoint, 0, rewardEndBlock, mvsLpContract, true, { from: config.deployAccount });
        //console.log("addResult");
        //console.log(JSON.stringify(addResult))
        return true;
    }

    doCreate().then(console.log).catch(console.log);
}