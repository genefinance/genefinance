module.exports = {
    rewardPerBlock: '100000000000000000000',
    startBlock: 8689300,
    bonusEndBlock: 8700000,

    //init pools
    initPools: [
        {//ETH/DAI UNI-LP
            address: '0x1c5dee94a34d795f9eeef830b68b80e44868d316',
            point: 1000
        },
        {//ETH/COMP UNI-LP
            address: '0xe0e6a62dfcea4386fb3a9d4a58ae474f2d1f0870',
            point: 1000
        }
    ],

    //factory of Uniswap V2
    factoryContract: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    //contract of WETH
    wethContract: "0xc778417e063141139fce010982780140aa0cd5ab",

    //MVS-ETH UNI-V2 LP Token address. Add manually after creating it 
    mvsLpContract: "",
    mvsLpPoint: 2000,

    //DNA-ETH UNI-V2 LP Token address. Add manually after creating it 
    dnaLpContract: "",
    dnaLpPoint: 2000,
}