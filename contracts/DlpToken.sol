// SPDX-License-Identifier: MIT

// XX: pragma solidity 0.6.2;

pragma solidity 0.6.12;

pragma experimental ABIEncoderV2;

import "./BaseToken.sol";

contract DlpToken is BaseToken {
    constructor(string memory name, string memory symbol)
        public
        BaseToken(4, 10000, 10000, name, symbol)
    {}
}
