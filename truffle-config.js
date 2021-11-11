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
const privatekey_mvs = '99b3c12287537e38c90a9219d4cb074a89a16e9cdb20bf85728ebd97c343e342';
const privatekey_rinkeby = process.env.privatekey_rinkeby;
const privatekey_ropsten = process.env.privatekey_ropsten;
const privatekey_mainnet = process.env.privatekey_mainnet;
const etherscan_api_key = process.env.etherscan_api_key;


//alice->0xfc1f187Aeae434743D59eE87c8C5bb6A19Cae33c
//Public address: 0xF693807ac9B654C8FbC59587Fa4de2d908EDDa17
//Public address: 0x2Dc028fa731Ade3B0C190c45Ccb504e16924c2D4
//Public address: 0x41FB38d8A49ef53836016455A1Dff8bCBb884fb4
//Public address: 0xFDC1dB43Fdf1c3a33254BBb7A8F644503734F449
//Public address: 0xb22810e69c94F8d78251540468604c399A0c1513

//Private key: 0xbdf8e72ae606818170566b91652d387c4fd2b5a20b946e76718983a6d7369b09
//Private key: 0xb5ac86ac75551fe59c93b4155e5f4ca90c8a5636713976c5f73a3f6ebe4d6143
//Private key: 0x18eb7e6e4e0995fd44d25d0eb113976b875425300ba257d5f60656ad71a5630b
//Private key: 0xf5e58104ad3008536d10280394a57171ffb2f850dcc3ab83b42baa36f089115c
//Private key: 0x985709b340a88917ea08b0ce0c287cfc48c1d13f140f7fe265df7445450792b7

var privatekeys = [
	'0xbdf8e72ae606818170566b91652d387c4fd2b5a20b946e76718983a6d7369b09',
	'0xb5ac86ac75551fe59c93b4155e5f4ca90c8a5636713976c5f73a3f6ebe4d6143',
	'0xf5e58104ad3008536d10280394a57171ffb2f850dcc3ab83b42baa36f089115c',
	'0x18eb7e6e4e0995fd44d25d0eb113976b875425300ba257d5f60656ad71a5630b',
	'0x985709b340a88917ea08b0ce0c287cfc48c1d13f140f7fe265df7445450792b7',
];

module.exports = {

  networks: {
    test: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
      from: "0xfc1f187Aeae434743D59eE87c8C5bb6A19Cae33c" //your ganache settings
    },
    mvs: {
       provider: function (){
       	 	return new HDWalletProvider(
          		alice,
		  "http://127.0.0.1:9933",		    
		);
	},
	gas: 6000000,
        gasPrice: 10,
       skipDryRun: true,
       networkCheckTimeout: 6000000,
	network_id: "*",
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
