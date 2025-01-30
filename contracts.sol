// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EnergyTrading {
    struct Offer {
        address seller;
        uint256 pricePerUnit;
        uint256 quantity;
    }

    struct Bid {
        address bidder;
        uint256 pricePerUnit;
        uint256 quantity;
    }

    mapping(uint256 => Offer) public offers;
    mapping(uint256 => Bid) public bids;
    mapping(uint256 => uint256) public bidIdToLockedEther;
    
    uint256 public offerId = 0;
    uint256 public bidId = 0;
    uint256 public activeOfferCount = 0;
    uint256 public activeBidCount = 0;
    
    mapping(address => uint256) public energyBalance;

    event OfferCreated(uint256 indexed offerId, address seller, uint256 pricePerUnit, uint256 quantity);
    event BidCreated(uint256 indexed bidId, address bidder, uint256 pricePerUnit, uint256 quantity);
    event OfferPurchased(uint256 indexed offerId, address buyer, uint256 quantityPurchased);
    event BidAccepted(uint256 indexed bidId, address seller, address buyer, uint256 quantity);
    event BidCancelled(uint256 indexed bidId);

    function createOffer(uint256 _pricePerUnit, uint256 _quantity) public {
        offers[offerId] = Offer(msg.sender, _pricePerUnit, _quantity);
        activeOfferCount++;
        emit OfferCreated(offerId, msg.sender, _pricePerUnit, _quantity);
        offerId++;
    }

    function createBid(uint256 _pricePerUnit, uint256 _quantity) public payable {
        uint256 totalPrice = _pricePerUnit * _quantity;
        require(msg.value == totalPrice, "Incorrect Ether sent");
        
        bids[bidId] = Bid(msg.sender, _pricePerUnit, _quantity);
        bidIdToLockedEther[bidId] = msg.value;
        activeBidCount++;
        emit BidCreated(bidId, msg.sender, _pricePerUnit, _quantity);
        bidId++;
    }

    function purchaseOffer(uint256 _offerId, uint256 _quantity) public payable {
        Offer storage offer = offers[_offerId];
        require(offer.quantity >= _quantity, "Not enough energy available");
        uint256 totalPrice = offer.pricePerUnit * _quantity;
        require(msg.value >= totalPrice, "Insufficient funds sent");

        offer.quantity -= _quantity;
        energyBalance[msg.sender] += _quantity;

        if (offer.quantity == 0) {
            delete offers[_offerId];
            activeOfferCount--;
        }

        payable(offer.seller).transfer(totalPrice);
        
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }

        emit OfferPurchased(_offerId, msg.sender, _quantity);
    }

    function acceptBid(uint256 _bidId) public {
        Bid storage bid = bids[_bidId];
        require(bid.bidder != address(0), "Bid does not exist");
        require(energyBalance[msg.sender] >= bid.quantity, "Insufficient energy");

        uint256 lockedEther = bidIdToLockedEther[_bidId];
        require(lockedEther > 0, "No locked Ether");

        energyBalance[msg.sender] -= bid.quantity;
        energyBalance[bid.bidder] += bid.quantity;

        payable(msg.sender).transfer(lockedEther);

        delete bids[_bidId];
        delete bidIdToLockedEther[_bidId];
        activeBidCount--;

        emit BidAccepted(_bidId, msg.sender, bid.bidder, bid.quantity);
    }

    function cancelBid(uint256 _bidId) public {
        Bid storage bid = bids[_bidId];
        require(bid.bidder == msg.sender, "Not the bidder");
        uint256 lockedEther = bidIdToLockedEther[_bidId];
        require(lockedEther > 0, "No locked Ether");

        payable(msg.sender).transfer(lockedEther);

        delete bids[_bidId];
        delete bidIdToLockedEther[_bidId];
        activeBidCount--;

        emit BidCancelled(_bidId);
    }

    function getOfferCount() public view returns (uint256) {
        return activeOfferCount;
    }

    function getBidCount() public view returns (uint256) {
        return activeBidCount;
    }

    function getOfferDetails(uint256 _offerId) public view returns (address, uint256, uint256) {
        Offer storage offer = offers[_offerId];
        return (offer.seller, offer.pricePerUnit, offer.quantity);
    }

    function getBidDetails(uint256 _bidId) public view returns (address, uint256, uint256, uint256) {
        Bid storage bid = bids[_bidId];
        return (bid.bidder, bid.pricePerUnit, bid.quantity, bidIdToLockedEther[_bidId]);
    }

    function getEnergyBalance(address user) public view returns (uint256) {
        return energyBalance[user];
    }
}
