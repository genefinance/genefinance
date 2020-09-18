pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/utils/EnumerableSet.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./MvsToken.sol";

interface IMigratorChef {
    // Perform LP token migration from legacy UniswapV2 to DnaSwap.
    // Take the current LP token address and return the new LP token address.
    // Migrator should have full access to the caller's LP token.
    // Return the new LP token address.
    //
    // XXX Migrator must have allowance access to UniswapV2 LP tokens.
    // DnaSwap must mint EXACTLY the same amount of DnaSwap LP tokens or
    // else something bad will happen. Traditional UniswapV2 does not
    // do that so be careful!
    function migrate(IERC20 token) external returns (IERC20);
}

// MasterChef is the master of DnaSwap. He can make DnaSwap and he is a fair guy.
//
// Note that it's ownable and the owner wields tremendous power. The ownership
// will be transferred to a governance smart contract once MVS is sufficiently
// distributed and the community can show to govern itself.
//
// Have fun reading it. Hopefully it's bug-free. God bless.
contract MasterChef is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // Info of each user.
    struct UserInfo {
        uint256 amount; // How many LP tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.
        //
        // We do some fancy math here. Basically, any point in time, the amount of MVSs
        // entitled to a user but is pending to be distributed is:
        //
        //   pending reward = (user.amount * pool.accMvsPerShare) - user.rewardDebt
        //
        // Whenever a user deposits or withdraws LP tokens to a pool. Here's what happens:
        //   1. The pool's `accMvsPerShare` (and `lastRewardBlock`) gets updated.
        //   2. User receives the pending reward sent to his/her address.
        //   3. User's `amount` gets updated.
        //   4. User's `rewardDebt` gets updated.
    }

    // Info of each pool.
    struct PoolInfo {
        IERC20 lpToken; // Address of LP token contract.
        uint256 allocPoint; // How many allocation points assigned to this pool. MVSs to distribute per block.
        uint256 lastRewardBlock; // Last block number that MVSs distribution occurs.
        uint256 accMvsPerShare; // Accumulated MVSs per share, times 1e12. See below.
        //attention: We added this lock
        uint256 lockEndBlock; // Earliest block number that LP token can be withdraw.
        uint256 rewardEndBlock; // Calculate reward before.
    }

    // The MVS TOKEN!
    MvsToken public mvs;
    // Dev address.
    address public devaddr;
    // Block number when bonus MVS period ends.
    uint256 public bonusEndBlock;
    // MVS tokens created per block.
    uint256 public mvsPerBlock;
    // Bonus muliplier for early mvs makers.
    uint256 public constant BONUS_MULTIPLIER = 10;
    // The migrator contract. It has a lot of power. Can only be set through governance (owner).
    IMigratorChef public migrator;

    // Info of each pool.
    PoolInfo[] public poolInfo;
    // Info of each user that stakes LP tokens.
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;
    // Total allocation poitns. Must be the sum of all allocation points in all pools.
    uint256 public totalAllocPoint = 0;
    // The block number when MVS mining starts.
    uint256 public startBlock;

    mapping(IERC20 => bool) public poolExists;

    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event EmergencyWithdraw(
        address indexed user,
        uint256 indexed pid,
        uint256 amount
    );

    constructor(
        MvsToken _mvs,
        address _devaddr,
        uint256 _mvsPerBlock,
        uint256 _startBlock,
        uint256 _bonusEndBlock
    ) public {
        mvs = _mvs;
        devaddr = _devaddr;
        mvsPerBlock = _mvsPerBlock;
        startBlock = _startBlock;
        bonusEndBlock = _bonusEndBlock;
    }

    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    // Add a new lp to the pool. Can only be called by the owner.
    // XXX DO NOT add the same LP token more than once. Rewards will be messed up if you do.
    function add(
        uint256 _allocPoint,
        uint256 _lockEndBlock,
        uint256 _rewardEndBlock,
        IERC20 _lpToken,
        bool _withUpdate
    ) public onlyOwner {
        require(poolExists[_lpToken] == false, "Add Pool: Already existed");
        if (_withUpdate) {
            massUpdatePools();
        }
        uint256 lastRewardBlock = block.number > startBlock
            ? block.number
            : startBlock;
        totalAllocPoint = totalAllocPoint.add(_allocPoint);
        poolInfo.push(
            PoolInfo({
                lpToken: _lpToken,
                allocPoint: _allocPoint,
                lastRewardBlock: lastRewardBlock,
                lockEndBlock: _lockEndBlock,
                rewardEndBlock: _rewardEndBlock,
                accMvsPerShare: 0
            })
        );
    }

    // Update the given pool's MVS allocation point. Can only be called by the owner.
    function set(
        uint256 _pid,
        uint256 _allocPoint,
        uint256 _rewardEndBlock,
        bool _withUpdate
    ) public onlyOwner {
        if (_withUpdate) {
            massUpdatePools();
        }
        totalAllocPoint = totalAllocPoint.sub(poolInfo[_pid].allocPoint).add(
            _allocPoint
        );
        poolInfo[_pid].allocPoint = _allocPoint;
        poolInfo[_pid].rewardEndBlock = _rewardEndBlock;
    }

    // Set the migrator contract. Can only be called by the owner.
    function setMigrator(IMigratorChef _migrator) public onlyOwner {
        migrator = _migrator;
    }

    // Migrate lp token to another lp contract. Can be called by anyone. We trust that migrator contract is good.
    function migrate(uint256 _pid) public {
        require(address(migrator) != address(0), "migrate: no migrator");
        PoolInfo storage pool = poolInfo[_pid];
        IERC20 lpToken = pool.lpToken;
        uint256 bal = lpToken.balanceOf(address(this));
        lpToken.safeApprove(address(migrator), bal);
        IERC20 newLpToken = migrator.migrate(lpToken);
        require(bal == newLpToken.balanceOf(address(this)), "migrate: bad");
        pool.lpToken = newLpToken;
    }

    // Return reward multiplier over the given _from to _to block.
    function getMultiplier(
        uint256 _from,
        uint256 _to,
        uint256 _rewardEndBlock
    ) public view returns (uint256) {
        if (_from > _rewardEndBlock) {
            return 0;
        }

        if (_to <= _rewardEndBlock) {
            if (_to <= bonusEndBlock) {
                return _to.sub(_from).mul(BONUS_MULTIPLIER);
            } else if (_from >= bonusEndBlock) {
                return _to.sub(_from);
            } else {
                return
                    bonusEndBlock.sub(_from).mul(BONUS_MULTIPLIER).add(
                        _to.sub(bonusEndBlock)
                    );
            }
        } else {
            if (_from >= bonusEndBlock) {
                return _rewardEndBlock.sub(_from);
            } else {
                return
                    bonusEndBlock.sub(_from).mul(BONUS_MULTIPLIER).add(
                        _rewardEndBlock.sub(bonusEndBlock)
                    );
            }
        }
    }

    // View function to see pending MVSs on frontend.
    function pendingMvs(uint256 _pid, address _user)
        external
        view
        returns (uint256)
    {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        uint256 accMvsPerShare = pool.accMvsPerShare;
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (block.number > pool.lastRewardBlock && lpSupply != 0) {
            uint256 multiplier = getMultiplier(
                pool.lastRewardBlock,
                block.number,
                pool.rewardEndBlock
            );
            uint256 mvsReward = multiplier
                .mul(mvsPerBlock)
                .mul(pool.allocPoint)
                .div(totalAllocPoint);
            accMvsPerShare = accMvsPerShare.add(
                mvsReward.mul(1e12).div(lpSupply)
            );
        }
        return user.amount.mul(accMvsPerShare).div(1e12).sub(user.rewardDebt);
    }

    // Update reward variables for all pools. Be careful of gas spending!
    function massUpdatePools() public {
        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            updatePool(pid);
        }
    }

    // Update reward variables of the given pool to be up-to-date.
    function updatePool(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        if (block.number <= pool.lastRewardBlock) {
            return;
        }
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (lpSupply == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }
        uint256 multiplier = getMultiplier(
            pool.lastRewardBlock,
            block.number,
            pool.rewardEndBlock
        );
        uint256 mvsReward = multiplier
            .mul(mvsPerBlock)
            .mul(pool.allocPoint)
            .div(totalAllocPoint);
        // attention: we remove dev reward
        //mvs.mint(devaddr, mvsReward.div(10));
        mvs.mint(address(this), mvsReward);
        pool.accMvsPerShare = pool.accMvsPerShare.add(
            mvsReward.mul(1e12).div(lpSupply)
        );
        pool.lastRewardBlock = block.number;
    }

    // Deposit LP tokens to MasterChef for MVS allocation.
    function deposit(uint256 _pid, uint256 _amount) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        updatePool(_pid);
        if (user.amount > 0) {
            uint256 pending = user
                .amount
                .mul(pool.accMvsPerShare)
                .div(1e12)
                .sub(user.rewardDebt);
            if (pending > 0) {
                safeMvsTransfer(msg.sender, pending);
            }
        }
        if (_amount > 0) {
            pool.lpToken.safeTransferFrom(
                address(msg.sender),
                address(this),
                _amount
            );
            user.amount = user.amount.add(_amount);
        }
        user.rewardDebt = user.amount.mul(pool.accMvsPerShare).div(1e12);
        emit Deposit(msg.sender, _pid, _amount);
    }

    // Withdraw LP tokens from MasterChef.
    function withdraw(uint256 _pid, uint256 _amount) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        require(user.amount >= _amount, "withdraw: not good");

        updatePool(_pid);
        uint256 pending = user.amount.mul(pool.accMvsPerShare).div(1e12).sub(
            user.rewardDebt
        );
        if (pending > 0) {
            safeMvsTransfer(msg.sender, pending);
        }
        if (_amount > 0) {
            //attention: We added this lock，lock MVS
            require(
                pool.lockEndBlock <= block.number,
                "withdraw: token locked"
            );
            user.amount = user.amount.sub(_amount);
            pool.lpToken.safeTransfer(address(msg.sender), _amount);
        }
        user.rewardDebt = user.amount.mul(pool.accMvsPerShare).div(1e12);
        emit Withdraw(msg.sender, _pid, _amount);
    }

    // Withdraw without caring about rewards. EMERGENCY ONLY.
    function emergencyWithdraw(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        pool.lpToken.safeTransfer(address(msg.sender), user.amount);
        emit EmergencyWithdraw(msg.sender, _pid, user.amount);
        user.amount = 0;
        user.rewardDebt = 0;
    }

    // Safe mvs transfer function, just in case if rounding error causes pool to not have enough MVSs.
    function safeMvsTransfer(address _to, uint256 _amount) internal {
        uint256 mvsBal = mvs.balanceOf(address(this));
        if (_amount > mvsBal) {
            mvs.transfer(_to, mvsBal);
        } else {
            mvs.transfer(_to, _amount);
        }
    }

    // Update dev address by the previous dev.
    function dev(address _devaddr) public {
        require(msg.sender == devaddr, "dev: wut?");
        devaddr = _devaddr;
    }
}
