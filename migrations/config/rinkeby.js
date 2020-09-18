module.exports = {
    rewardPerBlock: '100000000000000000000',
    startBlock: 7190500,
    bonusEndBlock: 7205000,

    //init pools
    initPools: [
        {//ETH/DAI UNI-LP
            address: '0x8b22f85d0c844cf793690f6d9dfe9f11ddb35449',
            point: 66
        },
        {//ETH/MKR UNI-LP
            address: '0x80f07c368bcc7f8cbac37e79ec332c1d84e9335d',
            point: 44
        }
    ],

    //factory of Uniswap V2
    factoryContract: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    //contract of WETH
    wethContract: "0xc778417e063141139fce010982780140aa0cd5ab",

    //MVS-ETH UNI-V2 LP Token address. Add manually after creating it 
    mvsLpContract: "",
    mvsLpPoint: 444,

    dnaTokenPoint: 222,
    dnaLockEndBlock: 7205000,

    etpTokenPoint: 222,
    etpLockEndBlock: 7205000
}