const { expectRevert, time } = require('@openzeppelin/test-helpers');
const MvsToken = artifacts.require('MvsToken');
const MasterChef = artifacts.require('MasterChef');
const MockERC20 = artifacts.require('MockERC20');

contract('MasterChef', ([alice, bob, carol, dev, minter]) => {
    beforeEach(async () => {
        this.mvs = await MvsToken.new({ from: alice });
    });

    it('should set correct state variables', async () => {
        this.chef = await MasterChef.new(this.mvs.address, dev, '100', '0', '1000', '2000', { from: alice });
        await this.mvs.transferOwnership(this.chef.address, { from: alice });
        const mvs = await this.chef.mvs();
        const devaddr = await this.chef.devaddr();
        const owner = await this.mvs.owner();
        assert.equal(mvs.valueOf(), this.mvs.address);
        assert.equal(devaddr.valueOf(), dev);
        assert.equal(owner.valueOf(), this.chef.address);
    });

    it('should allow dev and only dev to update dev', async () => {
        this.chef = await MasterChef.new(this.mvs.address, dev, '100', '0', '1000', '2000', { from: alice });
        assert.equal((await this.chef.devaddr()).valueOf(), dev);
        await expectRevert(this.chef.dev(bob, { from: bob }), 'dev: wut?');
        await this.chef.dev(bob, { from: dev });
        assert.equal((await this.chef.devaddr()).valueOf(), bob);
        await this.chef.dev(alice, { from: bob });
        assert.equal((await this.chef.devaddr()).valueOf(), alice);
    })

    context('With ERC/LP token added to the field', () => {
        beforeEach(async () => {
            this.lp = await MockERC20.new('LPToken', 'LP', '10000000000', { from: minter });
            await this.lp.transfer(alice, '1000', { from: minter });
            await this.lp.transfer(bob, '1000', { from: minter });
            await this.lp.transfer(carol, '1000', { from: minter });
            this.lp2 = await MockERC20.new('LPToken2', 'LP2', '10000000000', { from: minter });
            await this.lp2.transfer(alice, '1000', { from: minter });
            await this.lp2.transfer(bob, '1000', { from: minter });
            await this.lp2.transfer(carol, '1000', { from: minter });
        });

        it('should not allow emergency withdraw before global lock and should allow after global lock', async () => {
            // 100 per block farming rate starting at block 100 with bonus until block 1000
            this.chef = await MasterChef.new(this.mvs.address, dev, '100', '0', '1000', '2000', { from: alice });
            await this.chef.add('100', 0, "10000", this.lp.address, true);
            await this.lp.approve(this.chef.address, '1000', { from: bob });
            await this.chef.deposit(0, '100', { from: bob });

            assert.equal((await this.lp.balanceOf(bob)).valueOf(), '900');
            let that = this;
            async function shouldError() {
                //should not withdraw success
                return that.chef.emergencyWithdraw(0, { from: bob }).then((res) => {
                    assert.fail("The transaction should have thrown an error");
                }).catch((err) => {
                    console.log("emergencyWithdraw error:" + err.message);
                    assert.include(err.message, "revert", "The error message should contain 'revert'");
                })
            }
            await shouldError();
            assert.equal((await this.lp.balanceOf(bob)).valueOf(), '900');

            //wait for block 101
            await time.advanceBlockTo("101");
            await this.chef.emergencyWithdraw(0, { from: bob });//should withdraw success
            assert.equal((await this.lp.balanceOf(bob)).valueOf(), '1000');
        });

        it('should give out MVSs only after farming time', async () => {
            // 100 per block farming rate starting at block 100 with bonus until block 1000
            this.chef = await MasterChef.new(this.mvs.address, dev, '100', '200', '1000', '2000', { from: alice });
            await this.mvs.transferOwnership(this.chef.address, { from: alice });
            await this.chef.add('100', 0, "1000", this.lp.address, true);
            await this.lp.approve(this.chef.address, '1000', { from: bob });
            await this.chef.deposit(0, '100', { from: bob });
            await time.advanceBlockTo('189');
            await this.chef.deposit(0, '0', { from: bob }); // block 190
            assert.equal((await this.mvs.balanceOf(bob)).valueOf(), '0');
            await time.advanceBlockTo('194');
            await this.chef.deposit(0, '0', { from: bob }); // block 195
            assert.equal((await this.mvs.balanceOf(bob)).valueOf(), '0');
            await time.advanceBlockTo('199');
            await this.chef.deposit(0, '0', { from: bob }); // block 200
            assert.equal((await this.mvs.balanceOf(bob)).valueOf(), '0');
            await time.advanceBlockTo('200');
            await this.chef.deposit(0, '0', { from: bob }); // block 201
            assert.equal((await this.mvs.balanceOf(bob)).valueOf(), '100');
            await time.advanceBlockTo('204');
            await this.chef.deposit(0, '0', { from: bob }); // block 205
            assert.equal((await this.mvs.balanceOf(bob)).valueOf(), '500');
            assert.equal((await this.mvs.balanceOf(dev)).valueOf(), '0');
            assert.equal((await this.mvs.totalSupply()).valueOf(), '500');
        });

        it('should not distribute MVSs if no one deposit', async () => {
            // 100 per block farming rate starting at block 200 with bonus until block 1000
            this.chef = await MasterChef.new(this.mvs.address, dev, '100', '200', '1000', '2000', { from: alice });
            await this.mvs.transferOwnership(this.chef.address, { from: alice });
            await this.chef.add('100', 0, '1000', this.lp.address, true);
            await this.lp.approve(this.chef.address, '1000', { from: bob });
            await time.advanceBlockTo('299');
            assert.equal((await this.mvs.totalSupply()).valueOf(), '0');
            await time.advanceBlockTo('304');
            assert.equal((await this.mvs.totalSupply()).valueOf(), '0');
            await time.advanceBlockTo('409');
            await this.chef.deposit(0, '10', { from: bob }); // block 410
            assert.equal((await this.mvs.totalSupply()).valueOf(), '0');
            assert.equal((await this.mvs.balanceOf(bob)).valueOf(), '0');
            assert.equal((await this.mvs.balanceOf(dev)).valueOf(), '0');
            assert.equal((await this.lp.balanceOf(bob)).valueOf(), '990');
            await time.advanceBlockTo('419');
            await this.chef.withdraw(0, '10', { from: bob }); // block 220
            assert.equal((await this.mvs.totalSupply()).valueOf(), '1000');
            assert.equal((await this.mvs.balanceOf(bob)).valueOf(), '1000');
            assert.equal((await this.mvs.balanceOf(dev)).valueOf(), '0');
            assert.equal((await this.lp.balanceOf(bob)).valueOf(), '1000');
        });

        it('should distribute MVSs properly for each staker', async () => {
            // 100 per block farming rate starting at block 300 with bonus until block 1000
            this.chef = await MasterChef.new(this.mvs.address, dev, '100', '500', '1000', '2000', { from: alice });
            await this.mvs.transferOwnership(this.chef.address, { from: alice });
            await this.chef.add('100', 0, "1000", this.lp.address, true);
            await this.lp.approve(this.chef.address, '1000', { from: alice });
            await this.lp.approve(this.chef.address, '1000', { from: bob });
            await this.lp.approve(this.chef.address, '1000', { from: carol });
            // Alice deposits 10 LPs at block 510
            await time.advanceBlockTo('509');
            await this.chef.deposit(0, '10', { from: alice });
            // Bob deposits 10 LPs at block 514
            await time.advanceBlockTo('513');
            await this.chef.deposit(0, '10', { from: bob });
            // Carol deposits 30 LPs at block 518
            await time.advanceBlockTo('517');
            await this.chef.deposit(0, '30', { from: carol });
            // Alice deposits 30 more LPs at block 520. At this point:
            //   Alice should have: 4*100 + 4*1/2*100 + 2*1/5*100 = 640
            //   MasterChef should have the remaining: 1000 - 640 = 360
            await time.advanceBlockTo('519')
            await this.chef.deposit(0, '30', { from: alice });
            assert.equal((await this.mvs.totalSupply()).valueOf(), '1000');
            assert.equal((await this.mvs.balanceOf(alice)).valueOf(), '640');
            assert.equal((await this.mvs.balanceOf(bob)).valueOf(), '0');
            assert.equal((await this.mvs.balanceOf(carol)).valueOf(), '0');
            assert.equal((await this.mvs.balanceOf(this.chef.address)).valueOf(), '360');
            assert.equal((await this.mvs.balanceOf(dev)).valueOf(), '0');
            // Bob withdraws 5 LPs at block 530. At this point:
            // Bob should have: 4*1/2*100 + 2*1/5*100 + 10*1/8*100 = 365
            await time.advanceBlockTo('529')
            await this.chef.withdraw(0, '5', { from: bob });
            assert.equal((await this.mvs.totalSupply()).valueOf(), '2000');
            assert.equal((await this.mvs.balanceOf(alice)).valueOf(), '640');
            assert.equal((await this.mvs.balanceOf(bob)).valueOf(), '365');
            assert.equal((await this.mvs.balanceOf(carol)).valueOf(), '0');
            assert.equal((await this.mvs.balanceOf(this.chef.address)).valueOf(), '995');
            assert.equal((await this.mvs.balanceOf(dev)).valueOf(), '0');

        });

        it('should give proper MVSs allocation to each pool', async () => {
            // 100 per block farming rate starting at block 400 with bonus until block 1000
            this.chef = await MasterChef.new(this.mvs.address, dev, '1000', '600', '1000', '2000', { from: alice });
            await this.mvs.transferOwnership(this.chef.address, { from: alice });
            await this.lp.approve(this.chef.address, '1000', { from: alice });
            await this.lp2.approve(this.chef.address, '1000', { from: bob });
            // Add first LP to the pool with allocation 1
            await this.chef.add('10', '1000', '10000', this.lp.address, true);
            // Alice deposits 10 LPs at block 410
            await time.advanceBlockTo('609');
            await this.chef.deposit(0, '10', { from: alice });
            // Add LP2 to the pool with allocation 2 at block 420
            await time.advanceBlockTo('619');
            await this.chef.add('20', '1000', '10000', this.lp2.address, true);
            // Alice should have 10*1000 pending reward
            assert.equal((await this.chef.pendingMvs(0, alice)).valueOf(), '10000');
            // Bob deposits 10 LP2s at block 425
            await time.advanceBlockTo('624');
            await this.chef.deposit(1, '5', { from: bob });
            // Alice should have 10000 + 5*1/3*1000 = 11666 pending reward
            assert.equal((await this.chef.pendingMvs(0, alice)).valueOf(), '11666');
            await time.advanceBlockTo('630');
            // At block 430. Bob should get 5*2/3*1000 = 3333. Alice should get ~1666 more.
            assert.equal((await this.chef.pendingMvs(0, alice)).valueOf(), '13333');
            assert.equal((await this.chef.pendingMvs(1, bob)).valueOf(), '3333');
        });

        it('should stop giving bonus MVSs after the bonus period ends', async () => {
            // 100 per block farming rate starting at block 500 with bonus until block 600
            this.chef = await MasterChef.new(this.mvs.address, dev, '100', '700', '800', '900', { from: alice });
            await this.mvs.transferOwnership(this.chef.address, { from: alice });
            await this.lp.approve(this.chef.address, '1000', { from: alice });
            await this.chef.add('1', '1000', '1000', this.lp.address, true);
            // Alice deposits 10 LPs at block 790
            await time.advanceBlockTo('789');
            await this.chef.deposit(0, '10', { from: alice });
            // At block 605, she should have 100*10 + 1000*5 = 6000 pending.
            await time.advanceBlockTo('805');
            assert.equal((await this.chef.pendingMvs(0, alice)).valueOf(), '6000');
            // At block 806, Alice withdraws all pending rewards and should get 10600.
            await this.chef.deposit(0, '0', { from: alice });
            assert.equal((await this.chef.pendingMvs(0, alice)).valueOf(), '0');
            assert.equal((await this.mvs.balanceOf(alice)).valueOf(), '7000');//block 806

            await time.advanceBlockTo('816');
            assert.equal((await this.chef.pendingMvs(0, alice)).valueOf(), '10000');

            await time.advanceBlockTo('905');
            //(900-806)*1000+5*100
            console.log("balanceOf:" + (await this.chef.pendingMvs(0, alice)).valueOf());
            assert.equal((await this.chef.pendingMvs(0, alice)).valueOf(), '94500');

            // #906
            await this.chef.deposit(0, '0', { from: alice });
            assert.equal((await this.chef.pendingMvs(0, alice)).valueOf(), '0');
            assert.equal((await this.mvs.balanceOf(alice)).valueOf(), '101600');

            await time.advanceBlockTo('916');
            assert.equal((await this.chef.pendingMvs(0, alice)).valueOf(), '1000'); 
        });


        it('should stop reward after rewardEndBlock of pool', async () => {
            // 100 per block farming rate starting at block 500 with bonus until block 600
            this.chef = await MasterChef.new(this.mvs.address, dev, '100', '1000', '2000', '3000', { from: alice });
            await this.mvs.transferOwnership(this.chef.address, { from: alice });
            await this.lp.approve(this.chef.address, '1000', { from: alice });
            await this.chef.add('1', '1000', '1010', this.lp.address, true);
            // Alice deposits 10 LPs at block 990
            await time.advanceBlockTo('990');
            await this.chef.deposit(0, '10', { from: alice });
            // At block 1005, she should have 100*10 + 1000*5 = 6000 pending.
            await time.advanceBlockTo('1005');
            assert.equal((await this.chef.pendingMvs(0, alice)).valueOf(), '500');
            // At block 1006, Alice withdraws all pending rewards and should get 10600.
            await this.chef.deposit(0, '0', { from: alice });
            assert.equal((await this.chef.pendingMvs(0, alice)).valueOf(), '0');
            assert.equal((await this.mvs.balanceOf(alice)).valueOf(), '600');//block 806

            await time.advanceBlockTo('1010');
            assert.equal((await this.chef.pendingMvs(0, alice)).valueOf(), '400');

            await time.advanceBlockTo('1020');
            assert.equal((await this.chef.pendingMvs(0, alice)).valueOf(), '400');

            await this.chef.deposit(0, '0', { from: alice });
            assert.equal((await this.mvs.balanceOf(alice)).valueOf(), '1000');
        });

        it('should not allow withdraw lp before lock and allow after lock', async () => {
            // 100 per block farming rate starting at block 500 with bonus until block 600
            this.chef = await MasterChef.new(this.mvs.address, dev, '100', '1000', '2000', '3000', { from: alice });
            await this.mvs.transferOwnership(this.chef.address, { from: alice });
            await this.lp.approve(this.chef.address, '1000', { from: alice });
            await this.chef.add('1', '1100', '1200', this.lp.address, true);

            await this.chef.deposit(0, '10', { from: alice });
            assert.equal((await this.lp.balanceOf(alice)).valueOf(), '990');
            
            await time.advanceBlockTo('1090');

            let that = this;
            async function shouldError() {
                //should not withdraw success
                return that.chef.withdraw(0, '5', { from: alice }).then((res) => {
                    assert.fail("The transaction should have thrown an error");
                }).catch((err) => {
                    console.log("emergencyWithdraw error:" + err.message);
                    assert.include(err.message, "revert", "The error message should contain 'revert'");
                })
            }
            await shouldError(0);
            assert.equal((await this.lp.balanceOf(alice)).valueOf(), '990');

            await time.advanceBlockTo('1100');
            await this.chef.withdraw(0, '5', { from: alice });
            assert.equal((await this.lp.balanceOf(alice)).valueOf(), '995');
        });


        it('should not allow withdraw lp more than deposit', async () => {
            // 100 per block farming rate starting at block 500 with bonus until block 600
            this.chef = await MasterChef.new(this.mvs.address, dev, '100', '1000', '2000', '3000', { from: alice });
            await this.mvs.transferOwnership(this.chef.address, { from: alice });
            await this.lp.approve(this.chef.address, '1000', { from: alice });
            await this.chef.add('1', '1100', '1200', this.lp.address, true);

            await this.chef.deposit(0, '10', { from: alice });
            assert.equal((await this.lp.balanceOf(alice)).valueOf(), '990');
            

            let that = this;
            async function shouldError() {
                //should not withdraw success
                return that.chef.withdraw(0, '11', { from: alice }).then((res) => {
                    assert.fail("The transaction should have thrown an error");
                }).catch((err) => {
                    console.log("emergencyWithdraw error:" + err.message);
                    assert.include(err.message, "revert", "The error message should contain 'revert'");
                })
            }
            await shouldError();
            assert.equal((await this.lp.balanceOf(alice)).valueOf(), '990');

            await this.chef.withdraw(0, '10', { from: alice });
            assert.equal((await this.lp.balanceOf(alice)).valueOf(), '1000');
        });

        

    });
});
