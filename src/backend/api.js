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

app.get("/mine", (req, res, next) => {});

app.post("/transaction", (req, res, next) => {
  
});

app.listen(3000, () => {
  console.log("SERVER started on PORT " + port);
});
