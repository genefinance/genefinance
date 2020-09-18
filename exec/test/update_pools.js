var contract = artifacts.require("MasterChef");

var contract_address = '0x7006BBB3EFbac16dFc3f5865B43CBac7bD67693d';
var from = "0xEa15bd096c5331C5a1392b69dE3F1D8983d5dB7b";
//truffle exec ./exec/test/update_pools.js --network rinkeby
module.exports = function () {
    async function initPool() {
        let instance = await contract.at(contract_address);

        await instance.massUpdatePools({ from: from });
        
        return true;
    }
    initPool().then(console.log).catch(console.log);
}