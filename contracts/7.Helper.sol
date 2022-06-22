// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract Helper {

    address payable forceImplementation;
    constructor(address _forceImplementation) public payable {
        forceImplementation = payable(_forceImplementation);
    }

    function destroy() external {
        selfdestruct(forceImplementation);
    }
}