// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

/**
    Gate 1 can be passed by using a intermediate contract to make the call
    Gate 2 expects that the call to the enter function was made by the constructor of this intermediate contract
    And the gate 3 can be passed by getting bytes8(keccak256(abi.encodePacked(msg.sender))) and executing NOT operation so when XOR
    opertion is executed the result is the largest uint64 == uint64(0) - 1
 */
contract GatekeeperTwo {

  address public entrant;

  modifier gateOne() {
    require(msg.sender != tx.origin);
    _;
  }

  modifier gateTwo() {
    uint x;
    assembly { x := extcodesize(caller()) }
    require(x == 0);
    _;
  }

  modifier gateThree(bytes8 _gateKey) {
    require(uint64(bytes8(keccak256(abi.encodePacked(msg.sender)))) ^ uint64(_gateKey) == uint64(0) - 1);
    _;
  }

  function enter(bytes8 _gateKey) public gateOne gateTwo gateThree(_gateKey) returns (bool) {
    entrant = tx.origin;
    return true;
  }
}