module.exports = {
    deployAccount: '0xEa15bd096c5331C5a1392b69dE3F1D8983d5dB7b',
    rewardPerBlock: '100000000000000000000',
    startBlock: 8891107,
    bonusStartBlock: 8893237,
    bonusEndBlock: 8893957,
    rewardEndBlock: 8894677,

    //init pools
    initPools: [
    ],
    tokenPools: [
        {//ZB，DAI instead on ropsten
            address: '0xad6d458402f60fd3bd25163575031acdce07538d',
            point: 10,
            lockEndBlock: 8893237,
        }
    ],

    //factory of Uniswap V2
    factoryContract: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    //contract of WETH
    wethContract: "0xc778417e063141139fce010982780140aa0cd5ab",
    //USDT
    usdtContract: "",

    //TODO: Add manually after creating it 
    masterChefContract: '0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b',



    //TODO: Add manually after creating it 
    mvsTokenContract: '0xff2a1188225b2f0d09a8C42E15E0dbc52527689B',
    mvsLpContract: "",//Will try create pair if empty
    mvsLpPoint: 10,

    //DNA
    dnaTokenPoint: 50,
    dnaLockEndBlock: 8893237,
    //GENE
    mvsTokenPoint: 10,
    mvsLockEndBlock: 8893237,
    //ETP
    etpTokenPoint: 10,
    etpLockEndBlock: 8893237,
    //DLP
    dlpTokenPoint: 20,
    dlpLockEndBlock: 8893237,
}



