// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

import './helpers/Ownable-05.sol';

/**
    The contract use unsafe arithmetics, so it is possible to produce an underflow with the lenght of the array and make it expand to all the memory
    and then the slot where the owner is stored can be accessed and modified
    the owner is stored in slot 0
 */
contract AlienCodex is Ownable {

  bool public contact;
  bytes32[] public codex;

  modifier contacted() {
    assert(contact);
    _;
  }
  
  function make_contact() public {
    contact = true;
  }

  function record(bytes32 _content) contacted public {
  	codex.push(_content);
  }

  function retract() contacted public {
    codex.length--;
  }

  function revise(uint i, bytes32 _content) contacted public {
    codex[i] = _content;
  }
}
contract ComputeSlot {
    uint256 public slot = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff - 0xb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6 + 1;

 
}