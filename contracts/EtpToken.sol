// SPDX-License-Identifier: MIT

// XX: pragma solidity 0.6.2;

pragma solidity 0.6.12;

pragma experimental ABIEncoderV2;

import "./BaseToken.sol";

contract EtpToken is BaseToken {
    constructor(string memory name, string memory symbol)
        public
        BaseToken(8, 100000000, 100000000, name, symbol)
    {}
}