// To run with node.js, first: $ yarn add $polkadot/api
// then add commented lines:

const { xxhashAsHex, blake2AsHex } = require('@polkadot/util-crypto');
const { decodeAddress, encodeAddress } = require('@polkadot/keyring');
const util = require("@polkadot/util");
//const { u8aToHex } = require("@polkadot/util");

function evmToSub (evm_addr) {
	if (!(evm_addr.substring(0, 2) == "0x") || evm_addr.length != 42) {
		console.log("Invalid 0x address!")
		return
	}

	var u8a = util.hexToU8a(evm_addr)
	var prefix = new TextEncoder("utf-8").encode("dvm:\0\0\0\0\0\0\0");
	//var str = new TextDecoder("utf-8").decode(u8a);
	
	var udata = util.u8aConcat(prefix, u8a)
	var checksum = new TextEncoder("utf-8").encode("\0");
	for (let i=0; i<31; i++) {
		checksum[0] ^= udata[i]
	}

	var udata = util.u8aConcat(udata, checksum)
	var sub_addr = encodeAddress(util.u8aToHex(udata))

	return sub_addr
}

function subToEvm (sub_addr) {
	if (sub_addr.length != 48) {
		console.log("Invalid substrate address!")
		return
	}

	if (!haveValidEvm(sub_addr)) {
		return
	}
	
	var udata = decodeAddress(sub_addr)
	var evm_addr = util.u8aToHex(udata.slice(11, 31))
	return evm_addr
}

function haveValidEvm (sub_addr) {
	if (sub_addr.length != 48) {
		console.log("Invalid substrate address!")
		return false
	}

	var udata = decodeAddress(sub_addr)
	var checksum = new TextEncoder("utf-8").encode("\0");
	for (let i=0; i<31; i++) {
		checksum[0] ^= udata[i]
	}

	if (checksum[0] != udata[31]) {
		//console.log(`Checksum error: ${checksum[0]}, ${udata[31]}`)
		return false
	}
	
	return true
}


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

const res = evmToSub('0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b')
console.log(res)



module.exports.haveValidEvm = haveValidEvm
module.exports.subToEvm = subToEvm
module.exports.evmToSub = evmToSub

