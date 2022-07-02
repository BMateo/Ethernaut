// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
import "hardhat/console.sol";
interface IPrivacy {
    function unlock(bytes16 _key) external; 
}
contract PrivacyAttacker {

    bytes32 response32 = 0x1c4bfc9f16029bcc9fe82086e0eefcf454ea4baf1602da2cb67da712386cd203;
    
    function callUnlock(address _privacyInstance) external {
      IPrivacy instance = IPrivacy(_privacyInstance);
      instance.unlock(bytes16(response32));
    }

    function bytesCheck() external view returns(bytes16){
      return bytes16(response32);
    }

}