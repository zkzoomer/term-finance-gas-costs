var api = require('etherscan-api').init('YOUR_API_KEY');
const lastAuctions = require('./last-30-auctions.json');
const auctionProofGasCost = 350_000;

const main = async () => {
    var totalTermAuctionGas = 0;
    var totalProofAuctionGas = 0;

    // Cumulative `completeAuction` gas cost over last 30 auctions
    for (const termAuction of lastAuctions.TermAuction) {
        const results = (await api.account.txlist(termAuction, 1, 'latest', 1, 100, 'desc')).result;
        const completeAuctionTxs = results.filter(result => result.methodId === '0xf691fac1'); // completeAuction()
        for (const completeAuctionTx of completeAuctionTxs) totalTermAuctionGas += parseInt(completeAuctionTx.gasUsed);

        // Using a ZK proof, the whole auction process has a constant gas cost, regardles of the number of bids/offers
        totalProofAuctionGas += auctionProofGasCost;
    }

    // Cumulative `revealBids` gas cost
    for (const bidLocker of lastAuctions.BidLocker) {
        const results = (await api.account.txlist(bidLocker, 1, 'latest', 1, 100, 'desc')).result;
        const revealBidsTxs = results.filter(result => result.methodId === '0x5c164567'); // revealBids()
        for (const revealBidTx of revealBidsTxs) totalTermAuctionGas += parseInt(revealBidTx.gasUsed);
    }

    // Cumulative `revealOffers` gas cost
    for (const offerLocker of lastAuctions.OfferLocker) {
        const results = (await api.account.txlist(offerLocker, 1, 'latest', 1, 100, 'desc')).result;
        const revealOfferTxs = results.filter(result => result.methodId === '0x5ff8d526'); // revealOffers()
        for (const revealOfferTx of revealOfferTxs) totalTermAuctionGas += parseInt(revealOfferTx.gasUsed);
    }

    const costReduction = (100 * (totalTermAuctionGas - totalProofAuctionGas) / totalTermAuctionGas).toFixed(2);
    console.log(`Total auction cumulative gas cost: ${totalTermAuctionGas} gas`);
    console.log(`Proposed version cumulative gas cost: ${totalProofAuctionGas} gas; Average cost reduction: ${costReduction}%`);
}

( async () => {
    await main();
}) ();
