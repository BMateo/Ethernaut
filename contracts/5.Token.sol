// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

/**
    As the pragma is lesser than 0.8.0, the contract can suffer an arithmetic error
    if we substract a value greater than the your balance, it will produce an underflow an set the number to the max uint
    the contract should use SafeMath
 */
contract Token {

  mapping(address => uint) balances;
  uint public totalSupply;

  constructor(uint _initialSupply) public {
    balances[msg.sender] = totalSupply = _initialSupply;
  }

  function transfer(address _to, uint _value) public returns (bool) {
    require(balances[msg.sender] - _value >= 0);
    balances[msg.sender] -= _value;
    balances[_to] += _value;
    return true;
  }

  function balanceOf(address _owner) public view returns (uint balance) {
    return balances[_owner];
  }
}