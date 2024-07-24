const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = 3000;

app.get("/blockchain", (req, res, next) => {});

app.get("/mine", (req, res, next) => {});

app.post("/transaction", (req, res, next) => {
  console.log(req.body);
  res.send(`The amount sent: ${req.body.amount} duhcoins`);
});

app.listen(3000, () => {
  console.log("SERVER started on PORT " + port);
});
