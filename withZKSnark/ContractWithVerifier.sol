
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./verifier.sol";  // Import the zk-SNARK Verifier Contract

contract EnergyTrading {
    Verifier public verifier; // Reference to the verifier contract

    constructor(address _verifierAddress) {
        verifier = Verifier(_verifierAddress);
    }

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
    mapping(address => uint256) public energyBalance;
    mapping(address => uint256) public carbonCredits;

    uint256 public offerId = 0;
    uint256 public carbonCreditOfferId = 0;
    uint256 public activeOfferCount = 0;
    uint256 public activeCarbonCreditOfferCount = 0;

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
    function purchaseOffer(
        uint256 _offerId, 
        uint256 _quantity,
        uint256[2] memory _proofA,
        uint256[2][2] memory _proofB,
        uint256[2] memory _proofC,
        uint256[7] memory _publicSignals
    ) public payable {
        // Verify zk-SNARK proof before proceeding
        require(verifier.verifyProof(_proofA, _proofB, _proofC, _publicSignals), "Invalid ZK proof");

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

    function purchaseCarbonCredit(
        uint256 _carbonCreditOfferId, 
        uint256 _quantity,
        uint256[2] memory _proofA,
        uint256[2][2] memory _proofB,
        uint256[2] memory _proofC,
        uint256[7] memory _publicSignals
    ) public payable {
        // Verify zk-SNARK proof before proceeding
        require(verifier.verifyProof(_proofA, _proofB, _proofC, _publicSignals), "Invalid ZK proof");

        CarbonCreditOffer storage offer = carbonCreditOffers[_carbonCreditOfferId];
        require(offer.quantity >= _quantity, "Not enough carbon credits available");
        uint256 totalPrice = offer.pricePerCredit * _quantity;
        require(msg.value >= totalPrice, "Insufficient funds sent");

        offer.quantity -= _quantity;
        carbonCredits[offer.seller] -= _quantity;
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

    function updateRenewableEnergy(uint256 _amount) public {
        energyBalance[msg.sender] += _amount;
        carbonCredits[msg.sender] += _amount / 10;
        emit EnergyUpdated(msg.sender, energyBalance[msg.sender], true);
    }

    function updateNonRenewableEnergy(uint256 _amount) public {
        energyBalance[msg.sender] += _amount;
        emit EnergyUpdated(msg.sender, energyBalance[msg.sender], false);
    }

    function getEnergyBalance(address _user) public view returns (uint256) {
        return energyBalance[_user];
    }

    function getCarbonCredits(address _user) public view returns (uint256) {
        return carbonCredits[_user];
    }
}
