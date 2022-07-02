// SPDX-License-Identifier: MIT
pragma solidity ^0.6.4;

/**
Result: 
  The evm load the runtime code locally and run all the intruction in order
  initialization bytecode:
    push 0a push 0c push 80 39 push 0a push 01 f3
    600a600c600039600a6000f3
  runtime bytecode:
    push 2a push 00 mstore push 01 push 20 return
    602a60905260206090f3

    ethernaut console: await sendTransaction({from:player, data:"0x600a600c600039600a6000f3602a60905260206090f3"})
 */
contract MagicNum {

  address public solver;

  constructor() public {}

  function setSolver(address _solver) public {
    solver = _solver;
  }

  /*
    ____________/\\\_______/\\\\\\\\\_____        
     __________/\\\\\_____/\\\///////\\\___       
      ________/\\\/\\\____\///______\//\\\__      
       ______/\\\/\/\\\______________/\\\/___     
        ____/\\\/__\/\\\___________/\\\//_____    
         __/\\\\\\\\\\\\\\\\_____/\\\//________   
          _\///////////\\\//____/\\\/___________  
           ___________\/\\\_____/\\\\\\\\\\\\\\\_ 
            ___________\///_____\///////////////__
  */
}