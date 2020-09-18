module.exports = {
    deployAccount: '0xEa15bd096c5331C5a1392b69dE3F1D8983d5dB7b',
    rewardPerBlock: '100000000000000000000',
    startBlock: 8708162,
    bonusEndBlock: 8714808,
    rewardEndBlock: 8721454,

    //init pools
    initPools: [
        {//ETH/DAI UNI-LP
            address: '0x1c5dee94a34d795f9eeef830b68b80e44868d316',
            point: 66
        },
        {//ETH/COMP UNI-LP
            address: '0xe0e6a62dfcea4386fb3a9d4a58ae474f2d1f0870',
            point: 44
        }
    ],

    //factory of Uniswap V2
    factoryContract: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    //contract of WETH
    wethContract: "0xc778417e063141139fce010982780140aa0cd5ab",

    //TODO: Add manually after creating it 
    masterChefContract: '0xF75B7e9e2e99345F8CC62afDDf486F7563753a32',

    //TODO: Add manually after creating it 
    mvsTokenContract: '0x9161c626B0Da9cE64bB83cb960d70DE39C35A77e',
    mvsLpContract: "",//Will try create pair if empty
    mvsLpPoint: 446,

    dnaTokenPoint: 222,
    dnaLockEndBlock: 8711485,

    etpTokenPoint: 222,
    etpLockEndBlock: 8711485
}