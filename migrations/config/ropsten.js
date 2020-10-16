module.exports = {
    deployAccount: '0xEa15bd096c5331C5a1392b69dE3F1D8983d5dB7b',
    rewardPerBlock: '100000000000000000000',
    startBlock: 8838000,
    bonusStartBlock: 8838000,
    bonusEndBlock: 8878000,
    rewardEndBlock: 8918000,

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
    masterChefContract: '',

    //TODO: Add manually after creating it 
    mvsTokenContract: '',
    mvsLpContract: "",//Will try create pair if empty
    mvsLpPoint: 446,

    dnaTokenPoint: 222,
    dnaLockEndBlock: 8878000,

    etpTokenPoint: 222,
    etpLockEndBlock: 8878000
}