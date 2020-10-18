module.exports = {
    deployAccount: '0xC35e07aC812f3767eaDcc552033abdb431522536',
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
    masterChefContract: '',

    //TODO: Add manually after creating it 
    mvsTokenContract: '',
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