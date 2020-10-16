// SPDX-License-Identifier: MIT

// XX: pragma solidity 0.6.2;

pragma solidity 0.6.12;

pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/presets/ERC20PresetMinterPauser.sol";

contract BaseToken is ERC20PresetMinterPauser {
    bytes32 public constant ADJUST_ROLE = keccak256("ADJUST_ROLE");
    bytes32 public constant DELIVER_ROLE = keccak256("DELIVER_ROLE");

    string[100] private txidArray;
    uint256 arrayLength = 100;
    uint256 private id;

    uint256 private _minDeliver;
    uint256 private _minCollect;

    // uint8 private decimals_;

    event Deliver(address indexed to, uint256 amount, string from, string txid);

    event Collect(address indexed from, uint256 amount, string to);

    constructor(
        uint8 decimal,
        uint256 minDeliver,
        uint256 minCollect,
        string memory name,
        string memory symbol
    ) public ERC20PresetMinterPauser(name, symbol) {
        super._setupDecimals(decimal);
        _minDeliver = minDeliver;
        _minCollect = minCollect;
        _setupRole(ADJUST_ROLE, _msgSender());
        _setupRole(DELIVER_ROLE, _msgSender()); //SET TO Constructor
    }

    function deliver(
        address to,
        uint256 amount,
        string memory from,
        string memory txid
    ) public {
        require(
            amount >= _minDeliver,
            "The minimum value must be greater than minDeliver"
        );
        require(
            hasRole(DELIVER_ROLE, _msgSender()),
            "Must have deliver role to deliver"
        );
        for (uint256 i = 0; i < arrayLength; i++) {
            require(
                keccak256(abi.encodePacked(txidArray[i])) !=
                    keccak256(abi.encodePacked(txid)),
                "The txid has existed"
            );
        }
        uint256 id_number = id % arrayLength;
        txidArray[id_number] = txid;
        id++;
        //transfer(to, amount);
        //NEED MINTER_ROLE
        super.mint(to, amount);
        emit Deliver(to, amount, from, txid);
    }

    function collect(uint256 amount, string memory to) public {
        require(
            amount >= _minCollect,
            "The minimum value must be greater than minCollect"
        );
        super.burn(amount);
        emit Collect(msg.sender, amount, to);
    }

    function adjustParams(uint256 minDeliver, uint256 minCollect) public {
        require(hasRole(ADJUST_ROLE, _msgSender()), "Adjust role required");
        _minDeliver = minDeliver;
        _minCollect = minCollect;
    }

    function getParams() public view returns (uint256, uint256) {
        return (_minDeliver, _minCollect);
    }

    function getTxids() public view returns (string[100] memory) {
        return txidArray;
    }
}
