const sha256 = require("sha256");
const { v1: uuid } = require("uuid");

const currentNodeUrl = process.argv[3];

class Blockchain {
  constructor() {
    this.chain = [];
    this.pendingTransactions = [];

    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = [];

    this.createBlock(0, "0", "0");
  }

  createBlock(nonce, previousBlockHash, hash) {
    const newBlock = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.pendingTransactions,
      nonce: nonce,
      hash: hash,
      previousBlockHash: previousBlockHash,
    };

    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
  }

  createTransaction(amount, sender, recipient) {
    const newTransaction = {
      id: uuid().split("-").join(""),
      amount: amount,
      sender: sender,
      recipient: recipient,
    };

    return newTransaction;
  }

  addToPending(transaction) {
    this.pendingTransactions.push(transaction);
    return this.getLastBlock().index + 1;
  }

  hashBlock(previousBlockHash, currentBlockData, nonce) {
    const dataAsString =
      previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);
    return hash;
  }

  proofOfWork(previouseBlockHash, currentBlockData) {
    let nonce = 0;
    let hash = this.hashBlock(previouseBlockHash, currentBlockData, nonce);

    while (hash.substring(0, 4) !== "0000") {
      nonce++;
      hash = this.hashBlock(previouseBlockHash, currentBlockData, nonce);
    }

    return nonce;
  }

  isValid(blockchain) {
    const genesisBlock = blockchain[0];

    if (
      genesisBlock.nonce !== 0 ||
      genesisBlock.previousBlockHash !== "0" ||
      genesisBlock.hash !== "0" ||
      genesisBlock.transactions.length !== 0
    )
      return false;

    for (let i = 1; i < blockchain.length; ++i) {
      const currentBlock = blockchain[i];
      const previousBlock = blockchain[i - 1];
      const blockHash = this.hashBlock(
        previousBlock.hash,
        {
          transactions: currentBlock.transaction,
          index: currentBlock.index,
        },
        currentBlock.nonce
      );

      if (currentBlock.previousBlockHash !== previousBlock.hash) return false;
      if (blockHash.substring(0, 4) !== "0000") return false;
    }

    return true;
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }
}

module.exports = Blockchain;
