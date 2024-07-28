const express = require("express");
const bodyParser = require("body-parser");
const Blockchain = require("../blockchain");
const { v1: uuid } = require("uuid");
const rp = require("request-promise");

const nodeAddress = uuid().split("-").join("");

const duhCoin = new Blockchain();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.argv[2];

app.get("/blockchain", (req, res, next) => {
  res.send(duhCoin);
});

app.get("/consensus", (req, res) => {
  const blockPromises = [];

  duhCoin.networkNodes.forEach((node) => {
    const requestOptions = {
      uri: node + "/blockchain",
      method: "GET",
      json: true,
    };

    blockPromises.push(rp(requestOptions));
  });

  Promise.all(blockPromises).then((blockchains) => {
    const currentLength = duhCoin.chain.length;
    let maxLength = currentLength;
    let newChain = null;
    let newPendingTransactions = null;

    blockchains.forEach((blockchain) => {
      if (
        blockchain.chain.length > maxLength &&
        duhCoin.isValid(blockchain.chain)
      ) {
        maxLength = blockchain.chain.length;
        newChain = blockchain.chain;
        newPendingTransactions = blockchain.pendingTransactions;
      }
    });

    if (!newChain) {
      res.json({
        note: "Current chain has not been replaced.",
        chain: duhCoin.chain,
      });
    } else {
      duhCoin.chain = newChain;
      duhCoin.pendingTransactions = newPendingTransactions;

      res.json({
        note: "Current chain has been replaced.",
        chain: duhCoin.chain,
      });
    }
  });
});

app.get("/mine", (req, res, next) => {
  const lastBlock = duhCoin.getLastBlock();
  const previousBlockHash = lastBlock.hash;
  const currentBlockData = {
    transactions: duhCoin.pendingTransactions,
    index: lastBlock.index + 1,
  };

  const nonce = duhCoin.proofOfWork(previousBlockHash, currentBlockData);
  const currentBlockHash = duhCoin.hashBlock(
    previousBlockHash,
    currentBlockData,
    nonce
  );

  const newBlock = duhCoin.createBlock(
    nonce,
    previousBlockHash,
    currentBlockHash
  );

  const blockPromises = [];

  duhCoin.networkNodes.forEach((node) => {
    const requestOptions = {
      uri: node + "/getBlock",
      method: "POST",
      body: { newBlock: newBlock },
      json: true,
    };

    blockPromises.push(rp(requestOptions));
  });

  Promise.all(blockPromises)
    .then(() => {
      const requestOptions = {
        uri: duhCoin.currentNodeUrl + "/transaction/broadcast",
        method: "POST",
        body: {
          amount: 1,
          sender: "00",
          recipient: nodeAddress,
        },
        json: true,
      };

      return rp(requestOptions);
    })
    .then(() => {
      res.json({
        message: "New block mined and broadcasted successfully!",
        block: newBlock,
      });
    });
});

app.post("/getBlock", (req, res) => {
  const newBlock = req.body.newBlock;
  const lastBlock = duhCoin.getLastBlock();

  if (
    lastBlock.hash === newBlock.previousBlockHash &&
    lastBlock.index + 1 === newBlock.index
  ) {
    duhCoin.chain.push(newBlock);
    duhCoin.pendingTransactions = [];
    res.json({
      note: "New block received and accepted.",
      newBlock: newBlock,
    });
  } else {
    res.json({
      note: "New block rejected.",
      newBlock: newBlock,
    });
  }
});

app.post("/transaction", (req, res, next) => {
  const blockIndex = duhCoin.addToPending(req.body.newTransaction);
  res.json({
    note: `Transaction will be added in block ${blockIndex}.`,
  });
});

app.post("/transaction/broadcast", (req, res) => {
  const newTransaction = duhCoin.createTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );
  duhCoin.addToPending(newTransaction);

  const transactionPromises = [];

  duhCoin.networkNodes.forEach((nodeUrl) => {
    const requestOptions = {
      uri: nodeUrl + "/transaction",
      method: "POST",
      body: { newTransaction: newTransaction },
      json: true,
    };

    transactionPromises.push(rp(requestOptions));
  });

  Promise.all(transactionPromises).then((data) => {
    res.json({
      note: "Transaction created and broadcasted successfully.",
    });
  });
});

app.post("/registerBroadcast", (req, res) => {
  const newNodeUrl = req.body.newNodeUrl;
  if (duhCoin.networkNodes.indexOf(newNodeUrl) === -1)
    duhCoin.networkNodes.push(newNodeUrl);

  const registerPromises = [];

  duhCoin.networkNodes.forEach((nodeUrl) => {
    const requestOptions = {
      uri: nodeUrl + "/registerNode",
      method: "POST",
      body: { newNodeUrl: newNodeUrl },
      json: true,
    };

    registerPromises.push(rp(requestOptions));
  });

  Promise.all(registerPromises)
    .then((data) => {
      const requestOptions = {
        uri: newNodeUrl + "/registerBulk",
        method: "POST",
        body: { allNodes: [...duhCoin.networkNodes, duhCoin.currentNodeUrl] },
        json: true,
      };

      rp(requestOptions);
    })
    .then((data) => {
      res.json({
        note: "New node registered with network successfully.",
      });
    });
});

app.post("/registerNode", (req, res) => {
  const newNodeUrl = req.body.newNodeUrl;
  if (
    duhCoin.networkNodes.indexOf(newNodeUrl) === -1 &&
    newNodeUrl !== duhCoin.currentNodeUrl
  )
    duhCoin.networkNodes.push(newNodeUrl);
  res.json({
    note: "New node registered successfully with node.",
  });
});

app.post("/registerBulk", (req, res) => {
  const allNodes = req.body.allNodes;
  allNodes.forEach((node) => {
    if (
      node !== duhCoin.currentNodeUrl &&
      duhCoin.networkNodes.indexOf(node) === -1
    )
      duhCoin.networkNodes.push(node);
  });

  res.json({
    note: "Bulk registration successful.",
  });
});

app.listen(port, () => {
  console.log("SERVER started on PORT " + port);
  console.log(`Local address: http://localhost:${port}/`);
});
