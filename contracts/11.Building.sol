// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

interface IElevator {
    function goTo(uint _floor) external;
}
contract Edificio {

    uint public counter;
    IElevator public elevator;
    constructor(address _elevator) public {
        elevator = IElevator(_elevator);
        counter = 0;
    }

    function isLastFloor(uint _floor) external returns (bool){
        if(counter == 0){
            counter++;
            return false;
        } else {
            return true;
        }
    }

    function goToElevator() external {
        elevator.goTo(counter);
    }

}