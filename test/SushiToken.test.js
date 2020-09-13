const { expectRevert } = require('@openzeppelin/test-helpers');
const MvsToken = artifacts.require('MvsToken');

contract('MvsToken', ([alice, bob, carol]) => {
    beforeEach(async () => {
        this.mvs = await MvsToken.new({ from: alice });
    });

    it('should have correct name and symbol and decimal', async () => {
        const name = await this.mvs.name();
        const symbol = await this.mvs.symbol();
        const decimals = await this.mvs.decimals();
        assert.equal(name.valueOf(), 'MvsToken');
        assert.equal(symbol.valueOf(), 'MVS');
        assert.equal(decimals.valueOf(), '18');
    });

    it('should only allow owner to mint token', async () => {
        await this.mvs.mint(alice, '100', { from: alice });
        await this.mvs.mint(bob, '1000', { from: alice });
        await expectRevert(
            this.mvs.mint(carol, '1000', { from: bob }),
            'Ownable: caller is not the owner',
        );
        const totalSupply = await this.mvs.totalSupply();
        const aliceBal = await this.mvs.balanceOf(alice);
        const bobBal = await this.mvs.balanceOf(bob);
        const carolBal = await this.mvs.balanceOf(carol);
        assert.equal(totalSupply.valueOf(), '1100');
        assert.equal(aliceBal.valueOf(), '100');
        assert.equal(bobBal.valueOf(), '1000');
        assert.equal(carolBal.valueOf(), '0');
    });

    it('should supply token transfers properly', async () => {
        await this.mvs.mint(alice, '100', { from: alice });
        await this.mvs.mint(bob, '1000', { from: alice });
        await this.mvs.transfer(carol, '10', { from: alice });
        await this.mvs.transfer(carol, '100', { from: bob });
        const totalSupply = await this.mvs.totalSupply();
        const aliceBal = await this.mvs.balanceOf(alice);
        const bobBal = await this.mvs.balanceOf(bob);
        const carolBal = await this.mvs.balanceOf(carol);
        assert.equal(totalSupply.valueOf(), '1100');
        assert.equal(aliceBal.valueOf(), '90');
        assert.equal(bobBal.valueOf(), '900');
        assert.equal(carolBal.valueOf(), '110');
    });

    it('should fail if you try to do bad transfers', async () => {
        await this.mvs.mint(alice, '100', { from: alice });
        await expectRevert(
            this.mvs.transfer(carol, '110', { from: alice }),
            'ERC20: transfer amount exceeds balance',
        );
        await expectRevert(
            this.mvs.transfer(carol, '1', { from: bob }),
            'ERC20: transfer amount exceeds balance',
        );
    });
  });
