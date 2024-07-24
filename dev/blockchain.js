const sha256 = require("sha256");

class Blockchain {
  constructor() {
    this.chain = [];
    this.pendingTransactions = [];
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
      amount: amount,
      sender: sender,
      recipient: recipient,
    };

    this.pendingTransactions.push(newTransaction);

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
      console.log(hash);
    }

    return nonce;
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }
}

module.exports = Blockchain;
