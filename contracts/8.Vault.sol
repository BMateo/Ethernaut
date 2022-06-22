// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

//In the block scanner we can see the storage of the smart contract 
contract Vault {
  bool public locked;
  bytes32 private password;

  constructor(bytes32 _password) public {
    locked = true;
    password = _password;
  }

  function unlock(bytes32 _password) public {
    if (password == _password) {
      locked = false;
    }
  }
}