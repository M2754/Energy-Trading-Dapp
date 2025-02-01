// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EnergyTrading {
    struct Offer {
        address seller;
        uint256 pricePerUnit;
        uint256 quantity;
    }

    struct CarbonCreditOffer {
        address seller;
        uint256 pricePerCredit;
        uint256 quantity;
    }

    mapping(uint256 => Offer) public offers;
    mapping(uint256 => CarbonCreditOffer) public carbonCreditOffers;
    uint256 public offerId = 0;
    uint256 public carbonCreditOfferId = 0;
    uint256 public activeOfferCount = 0;
    uint256 public activeCarbonCreditOfferCount = 0;
    mapping(address => uint256) public energyBalance;
    mapping(address => uint256) public carbonCredits;

    event OfferCreated(uint256 indexed offerId, address seller, uint256 pricePerUnit, uint256 quantity);
    event CarbonCreditOfferCreated(uint256 indexed carbonCreditOfferId, address seller, uint256 pricePerCredit, uint256 quantity);
    event OfferPurchased(uint256 indexed offerId, address buyer, uint256 quantityPurchased);
    event CarbonCreditPurchased(uint256 indexed carbonCreditOfferId, address buyer, uint256 quantityPurchased);
    event EnergyUpdated(address indexed user, uint256 newEnergyBalance, bool isRenewable);

    function createOffer(uint256 _pricePerUnit, uint256 _quantity) public {
        offers[offerId] = Offer(msg.sender, _pricePerUnit, _quantity);
        activeOfferCount++;
        emit OfferCreated(offerId, msg.sender, _pricePerUnit, _quantity);
        offerId++;
    }

    function createCarbonCreditOffer(uint256 _pricePerCredit, uint256 _quantity) public {
        require(carbonCredits[msg.sender] >= _quantity, "Not enough carbon credits");
        carbonCredits[msg.sender] -= _quantity;
        carbonCreditOffers[carbonCreditOfferId] = CarbonCreditOffer(msg.sender, _pricePerCredit, _quantity);
        activeCarbonCreditOfferCount++;
        emit CarbonCreditOfferCreated(carbonCreditOfferId, msg.sender, _pricePerCredit, _quantity);
        carbonCreditOfferId++;
    }

    function purchaseOffer(uint256 _offerId, uint256 _quantity) public payable {
        Offer storage offer = offers[_offerId];
        require(offer.quantity >= _quantity, "Not enough energy available");
        uint256 totalPrice = offer.pricePerUnit * _quantity;
        require(msg.value >= totalPrice, "Insufficient funds sent");

        offer.quantity -= _quantity;
        energyBalance[offer.seller] -= _quantity;
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

    function getOfferDetails(uint256 _offerId) public view returns (address, uint256, uint256) {
        Offer storage offer = offers[_offerId];
        return (offer.seller, offer.pricePerUnit, offer.quantity);
    }

    function getCarbonCreditOfferDetails(uint256 _carbonCreditOfferId) public view returns (address, uint256, uint256) {
       CarbonCreditOffer storage offer = carbonCreditOffers[_carbonCreditOfferId];
        return (offer.seller, offer.pricePerCredit, offer.quantity);
    }


    function purchaseCarbonCredit(uint256 _carbonCreditOfferId, uint256 _quantity) public payable {
        CarbonCreditOffer storage offer = carbonCreditOffers[_carbonCreditOfferId];
        require(offer.quantity >= _quantity, "Not enough carbon credits available");
        uint256 totalPrice = offer.pricePerCredit * _quantity;
        require(msg.value >= totalPrice, "Insufficient funds sent");

        offer.quantity -= _quantity;
        carbonCredits[offer.seller]-=_quantity;
        carbonCredits[msg.sender] += _quantity;

        if (offer.quantity == 0) {
            delete carbonCreditOffers[_carbonCreditOfferId];
            activeCarbonCreditOfferCount--;
        }

        payable(offer.seller).transfer(totalPrice);
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }

        emit CarbonCreditPurchased(_carbonCreditOfferId, msg.sender, _quantity);
    }

    function updateNonRenewableEnergy(address user, uint256 amount) public {
        energyBalance[user] += amount;
        emit EnergyUpdated(user, energyBalance[user], false);
    }

    function updateRenewableEnergy(address user, uint256 amount, uint256 carbonCreditAmount) public {
        energyBalance[user] += amount;
        carbonCredits[user] += carbonCreditAmount;
        emit EnergyUpdated(user, energyBalance[user], true);
    }

    function getOfferCount() public view returns (uint256) {
        return activeOfferCount;
    }
    function getCarbonCreditOfferCount() public view returns (uint256) {
        return activeCarbonCreditOfferCount;
    }


    function getEnergyBalance(address user) public view returns (uint256) {
        return energyBalance[user];
    }

    function getCarbonCredits(address user) public view returns (uint256) {
        return carbonCredits[user];
    }
}
