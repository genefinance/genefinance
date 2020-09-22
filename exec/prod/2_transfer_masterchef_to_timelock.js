
const Timelock = artifacts.require("Timelock");

const MasterChef = artifacts.require("MasterChef");


//truffle exec ./exec/prod/2_transfer_masterchef_to_timelock.js --network ropsten
module.exports = function () {
    let network = process.argv[process.argv.length - 1]
    let config = require('../../migrations/config')(network);

    async function doTransfer() {

        let masterChefIns = await MasterChef.deployed();
        let timelockIns = await Timelock.deployed();
        console.log("masterChefIns:" + masterChefIns.address);
        console.log("timelockIns:" + timelockIns.address);

        await masterChefIns.transferOwnership(timelockIns.address, { from: config.deployAccount })

        return true;
    }

    doTransfer().then(console.log).catch(console.log);
}