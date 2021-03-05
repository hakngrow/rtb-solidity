pragma solidity ^0.5.17;

import './BidCoin.sol';
import '@openzeppelin/contracts/crowdsale/emission/MintedCrowdsale.sol';

    contract BidCoinCrowdsale is MintedCrowdsale {
    constructor (
        uint256 _rate,
        address payable _wallet,
        ERC20Mintable _token
    ) 
    public
        Crowdsale(_rate, _wallet, _token) {
    }
}
