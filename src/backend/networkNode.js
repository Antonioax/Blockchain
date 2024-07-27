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

  duhCoin.createTransaction(1, "00", nodeAddress);

  const newBlock = duhCoin.createBlock(
    nonce,
    previousBlockHash,
    currentBlockHash
  );

  res.json({
    message: "New block mined!",
    block: newBlock,
  });
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
