// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;


/**
    As the building is set as the msg.sender, it can be posible to trick this behave and make a custom isLastFloor to reach the top
    i use a counter and in the second call return true whatever the floor is
 */
interface Building {
  function isLastFloor(uint) external returns (bool);
}

contract Elevator {
  bool public top;
  uint public floor;

  function goTo(uint _floor) public {
    Building building = Building(msg.sender);

    if (! building.isLastFloor(_floor)) {
      floor = _floor;
      top = building.isLastFloor(floor);
    }
  }
}