template EnergyTrade() {
    signal input sellerBalance;
    signal input buyerBalance;
    signal input pricePerUnit;
    signal input quantity;
    signal input payment;
    signal input buyerAddress;

    signal output newSellerBalance;
    signal output newBuyerBalance;

    signal totalPrice;
    totalPrice <== pricePerUnit * quantity;

    totalPrice === payment;
    sellerBalance >= quantity;

    newSellerBalance <== sellerBalance - quantity;
    newBuyerBalance <== buyerBalance + quantity;
}

component main = EnergyTrade();
