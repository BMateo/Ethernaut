// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

/**
    We can steal the ownership of this contract by calling changeOwner by another contract
 */
contract Telephone {

  address public owner;

  constructor() public {
    owner = msg.sender;
  }

  function changeOwner(address _owner) public {
    if (tx.origin != msg.sender) {
      owner = _owner;
    }
  }
}