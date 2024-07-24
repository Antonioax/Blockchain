var express = require("express");
var app = express();

const port = 3000;

app.get("/blockchain", (req, res, next) => {});

app.get("/mine", (req, res, next) => {});

app.post("/transaction", (rew, res, next) => {});

app.listen(3000, () => {
  console.log("SERVER started on PORT " + port);
});
