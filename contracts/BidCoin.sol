pragma solidity ^0.5.17;

import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";
contract BidCoin is ERC20Mintable {

    string public name = "Bid Coin";
    string public symbol = "BC";
    uint8 public decimals = 9;
}