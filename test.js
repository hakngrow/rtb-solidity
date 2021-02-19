var Web3 = require('web3');
const web3 = new Web3('https://cloudflare-eth.com');

let latestKnownBlockNumber = -1;
let blockTime = 5000;

// Our function that will triggered for every block
async function processBlock(blockNumber) {

    console.log("We process block: " + blockNumber)

    let block = await web3.eth.getBlock(blockNumber);

    for (const transactionHash of block.transactions) {

        let transaction = await web3.eth.getTransaction(transactionHash);
        let transactionReceipt = await web3.eth.getTransactionReceipt(transactionHash);

        transaction = Object.assign(transaction, transactionReceipt);

        console.log("Transaction: ", transaction);
    }

    latestKnownBlockNumber = blockNumber;
}

// This function is called every blockTime, check the current block number and order the processing of the new block(s)
async function checkCurrentBlock() {
    const currentBlockNumber = await web3.eth.getBlockNumber()
    console.log("Current blockchain top: " + currentBlockNumber, " | Script is at: " + latestKnownBlockNumber)
    while (latestKnownBlockNumber == -1 || currentBlockNumber > latestKnownBlockNumber) {
        await processBlock(latestKnownBlockNumber == -1 ? currentBlockNumber : latestKnownBlockNumber + 1);
    }
    setTimeout(checkCurrentBlock, blockTime);
}

checkCurrentBlock()