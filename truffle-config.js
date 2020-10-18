const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) {
  throw result.error;
}
console.log(result.parsed);

const NonceTrackerSubprovider = require("web3-provider-engine/subproviders/nonce-tracker");

const HDWalletProvider = require("@truffle/hdwallet-provider");

const infura_v3_apikey = process.env.infura_v3_apikey;

const privatekey_develop = process.env.privatekey_develop;
const privatekey_rinkeby = process.env.privatekey_rinkeby;
const privatekey_ropsten = process.env.privatekey_ropsten;
const privatekey_mainnet = process.env.privatekey_mainnet;
const etherscan_api_key = process.env.etherscan_api_key;


module.exports = {
  // Uncommenting the defaults below
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  //
  networks: {
    // development: {
    //   //https://learnblockchain.cn/docs/truffle/quickstart.html#truffle-develop
    //   provider: new HDWalletProvider(privatekey_develop, "http://127.0.0.1:9545/"),
    //   network_id: "*"
    // },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(privatekey_rinkeby, "https://rinkeby.infura.io/v3/" + infura_v3_apikey)
      },
      network_id: 4,
      gas: 6000000,
      gasPrice: 30000000000,
      skipDryRun: true
    },
    ropsten: {
      provider: function () {
        //return new HDWalletProvider(privatekey_ropsten, "ws://54.150.115.249:8546")
        return new HDWalletProvider(privatekey_ropsten, "https://ropsten.infura.io/v3/" + infura_v3_apikey)
      },
      network_id: 3,
      gas: 6000000,
      gasPrice: 30 * 1000000000,
      skipDryRun: true,
      networkCheckTimeout: 60000,
    },
    mainnet: {
      provider: function () {
        var wallet = new HDWalletProvider(privatekey_mainnet, "https://mainnet.infura.io/v3/" + infura_v3_apikey);
        var nonceTracker = new NonceTrackerSubprovider();
        wallet.engine._providers.unshift(nonceTracker);
        nonceTracker.setEngine(wallet.engine);
        return wallet;
      },
      gas: 6000000,
      network_id: 1,
      gasPrice: 50 * 1000000000,
      skipDryRun: true,
      networkCheckTimeout: 600000,
    }

  },
  compilers: {
    solc: {
      version: "0.6.12"
    }
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: etherscan_api_key
  },
  verify: {
    preamble: "DNASwap Version: 1.0.0"
  }
};
