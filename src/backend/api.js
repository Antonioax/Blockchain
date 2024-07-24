const express = require("express");
const bodyParser = require("body-parser");
const Blockchain = require("../blockchain");

const duhCoin = new Blockchain();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = 3000;

app.get("/blockchain", (req, res, next) => {
  res.send(duhCoin);
});

app.get("/mine", (req, res, next) => {
  
});

app.post("/transaction", (req, res, next) => {
  if (req.body.amount && req.body.sender && req.body.recipient) {
    const blockIndex = duhCoin.createTransaction(
      req.body.amount,
      req.body.sender,
      req.body.recipient
    );

    res.json({ note: `Transaction will be added in block ${blockIndex}.` });
  } else {
    res.send("Error getting transaction data!");
  }
});

app.listen(3000, () => {
  console.log("SERVER started on PORT " + port);
});
