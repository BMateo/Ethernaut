// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function increaseAllowance(address spender, uint256 addedValue) external  returns (bool); 
}
 contract NaughtCoinAux  {

    constructor() public {
       
    }

     function transferTokens(address _coinImpl) external {
        IERC20 token = IERC20(_coinImpl);
        token.transferFrom(msg.sender, address(this), token.balanceOf(msg.sender));
    } 
} 