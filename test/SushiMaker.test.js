const MvsToken = artifacts.require('MvsToken');
const MvsMaker = artifacts.require('MvsMaker');
const MockERC20 = artifacts.require('MockERC20');
const UniswapV2Pair = artifacts.require('UniswapV2Pair');
const UniswapV2Factory = artifacts.require('UniswapV2Factory');

contract('MvsMaker', ([alice, bar, minter]) => {
    beforeEach(async () => {
        this.factory = await UniswapV2Factory.new(alice, { from: alice });
        this.mvs = await MvsToken.new({ from: alice });
        await this.mvs.mint(minter, '100000000', { from: alice });
        this.weth = await MockERC20.new('WETH', 'WETH', '100000000', { from: minter });
        this.token1 = await MockERC20.new('TOKEN1', 'TOKEN', '100000000', { from: minter });
        this.token2 = await MockERC20.new('TOKEN2', 'TOKEN2', '100000000', { from: minter });
        this.maker = await MvsMaker.new(this.factory.address, bar, this.mvs.address, this.weth.address);
        this.mvsWETH = await UniswapV2Pair.at((await this.factory.createPair(this.weth.address, this.mvs.address)).logs[0].args.pair);
        this.wethToken1 = await UniswapV2Pair.at((await this.factory.createPair(this.weth.address, this.token1.address)).logs[0].args.pair);
        this.wethToken2 = await UniswapV2Pair.at((await this.factory.createPair(this.weth.address, this.token2.address)).logs[0].args.pair);
        this.token1Token2 = await UniswapV2Pair.at((await this.factory.createPair(this.token1.address, this.token2.address)).logs[0].args.pair);
    });

    it('should make MVSs successfully', async () => {
        await this.factory.setFeeTo(this.maker.address, { from: alice });
        await this.weth.transfer(this.mvsWETH.address, '10000000', { from: minter });
        await this.mvs.transfer(this.mvsWETH.address, '10000000', { from: minter });
        await this.mvsWETH.mint(minter);
        await this.weth.transfer(this.wethToken1.address, '10000000', { from: minter });
        await this.token1.transfer(this.wethToken1.address, '10000000', { from: minter });
        await this.wethToken1.mint(minter);
        await this.weth.transfer(this.wethToken2.address, '10000000', { from: minter });
        await this.token2.transfer(this.wethToken2.address, '10000000', { from: minter });
        await this.wethToken2.mint(minter);
        await this.token1.transfer(this.token1Token2.address, '10000000', { from: minter });
        await this.token2.transfer(this.token1Token2.address, '10000000', { from: minter });
        await this.token1Token2.mint(minter);
        // Fake some revenue
        await this.token1.transfer(this.token1Token2.address, '100000', { from: minter });
        await this.token2.transfer(this.token1Token2.address, '100000', { from: minter });
        await this.token1Token2.sync();
        await this.token1.transfer(this.token1Token2.address, '10000000', { from: minter });
        await this.token2.transfer(this.token1Token2.address, '10000000', { from: minter });
        await this.token1Token2.mint(minter);
        // Maker should have the LP now
        assert.equal((await this.token1Token2.balanceOf(this.maker.address)).valueOf(), '16528');
        // After calling convert, bar should have MVS value at ~1/6 of revenue
        await this.maker.convert(this.token1.address, this.token2.address);
        assert.equal((await this.mvs.balanceOf(bar)).valueOf(), '32965');
        assert.equal((await this.token1Token2.balanceOf(this.maker.address)).valueOf(), '0');
        // Should also work for MVS-ETH pair
        await this.mvs.transfer(this.mvsWETH.address, '100000', { from: minter });
        await this.weth.transfer(this.mvsWETH.address, '100000', { from: minter });
        await this.mvsWETH.sync();
        await this.mvs.transfer(this.mvsWETH.address, '10000000', { from: minter });
        await this.weth.transfer(this.mvsWETH.address, '10000000', { from: minter });
        await this.mvsWETH.mint(minter);
        assert.equal((await this.mvsWETH.balanceOf(this.maker.address)).valueOf(), '16537');
        await this.maker.convert(this.mvs.address, this.weth.address);
        assert.equal((await this.mvs.balanceOf(bar)).valueOf(), '66249');
        assert.equal((await this.mvsWETH.balanceOf(this.maker.address)).valueOf(), '0');
    });
});