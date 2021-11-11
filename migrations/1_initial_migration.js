const Migrations = artifacts.require("Migrations");
const EthUtil = require('ethereumjs-util');
const web3 = require('web3');



module.exports = function(deployer, accounts) {
 deployer.deploy(Migrations);
};

