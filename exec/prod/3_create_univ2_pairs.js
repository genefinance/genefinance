const UniswapV2Factory = artifacts.require("UniswapV2Factory");

const factoryContract = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
const usdtContract = "0xdac17f958d2ee523a2206206994597c13d831ec7";
const wethTokenContract = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

const geneToken = "0xf6ec87DFE1Ed3a7256Cc0c38e3c8139103e9aF3b";
const dnaToken = "0xb1dF7CE84253ffcd01D92fA6662e761f86b61982";
const etpToken = "0x6A217345AEc9F9e64928793716dbEf15b8Ffe90D";
const dlpToken = "0xe92585F17A42Ee815a0bA448657f41f52f6b23e5";

//用主地址创建
const deployAccount = "";

//truffle exec ./exec/prod/3_create_univ2_pairs.js --network ropsten
//truffle exec ./exec/prod/3_create_univ2_pairs.js --network mainnet
module.exports = function () {
    async function doCreate() {
        let factory = await UniswapV2Factory.at(factoryContract);

        console.log("Create GENE/ETH pair");
        let gene_eth_result = await factory.createPair(wethTokenContract, geneToken, { from: deployAccount });
        let gene_eth_address = gene_eth_result.receipt.logs[0].args.pair;
        console.log("gene_eth_address:" + gene_eth_address);

        console.log("Create GENE/USDT pair");
        let gene_usdt_result = await factory.createPair(usdtContract, geneToken, { from: deployAccount });
        let gene_usdt_address = gene_usdt_result.receipt.logs[0].args.pair;
        console.log("gene_usdt_address:" + gene_usdt_address);

        console.log("Create DNA/ETH pair");
        let dna_eth_result = await factory.createPair(wethTokenContract, dnaToken, { from: deployAccount });
        let dna_eth_address = dna_eth_result.receipt.logs[0].args.pair;
        console.log("dna_eth_address:" + dna_eth_address);

        console.log("Create ETP/ETH pair");
        let etp_eth_result = await factory.createPair(wethTokenContract, etpToken, { from: deployAccount });
        let etp_eth_address = etp_eth_result.receipt.logs[0].args.pair;
        console.log("etp_eth_address:" + etp_eth_address);

        console.log("Create DLP/ETH pair");
        let dlp_eth_result = await factory.createPair(wethTokenContract, dlpToken, { from: deployAccount });
        let dlp_eth_address = dlp_eth_result.receipt.logs[0].args.pair;
        console.log("dlp_eth_address:" + dlp_eth_address);

        console.log("done");
        return true;
    }
    doCreate().then(console.log).catch(console.log);
}