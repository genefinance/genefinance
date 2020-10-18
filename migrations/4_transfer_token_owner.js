const MvsToken = artifacts.require("MvsToken");
const MasterChef = artifacts.require("MasterChef");


module.exports = async function (deployer, network, accounts) {
    
    let masterChefIns = await MasterChef.deployed();
    let mvsTokenIns = await MvsToken.deployed();

    await mvsTokenIns.transferOwnership(masterChefIns.address, { from: accounts[0] })
}