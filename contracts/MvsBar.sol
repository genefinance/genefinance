pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


contract MvsBar is ERC20("MvsBar", "xMVS"){
    using SafeMath for uint256;
    IERC20 public mvs;

    constructor(IERC20 _mvs) public {
        mvs = _mvs;
    }

    // Enter the bar. Pay some MVSs. Earn some shares.
    function enter(uint256 _amount) public {
        uint256 totalMvs = mvs.balanceOf(address(this));
        uint256 totalShares = totalSupply();
        if (totalShares == 0 || totalMvs == 0) {
            _mint(msg.sender, _amount);
        } else {
            uint256 what = _amount.mul(totalShares).div(totalMvs);
            _mint(msg.sender, what);
        }
        mvs.transferFrom(msg.sender, address(this), _amount);
    }

    // Leave the bar. Claim back your MVSs.
    function leave(uint256 _share) public {
        uint256 totalShares = totalSupply();
        uint256 what = _share.mul(mvs.balanceOf(address(this))).div(totalShares);
        _burn(msg.sender, _share);
        mvs.transfer(msg.sender, what);
    }
}