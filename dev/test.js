const Blockchain = require("./blockchain");

const DuhCoin = new Blockchain();

console.log(
  DuhCoin.hashBlock(
    "88h8h788h78hh",
    [
      { amount: 10, sender: "83e38eu8u3e", recipient: "u9u9e8u893e" },
      { amount: 20, sender: "83e38eu8u3e", recipient: "u9u9e8u893e" },
      { amount: 30, sender: "83e38eu8u3e", recipient: "u9u9e8u893e" },
    ],
    123
  )
);
