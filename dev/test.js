const Blockchain = require("./blockchain");

const DuhCoin = new Blockchain();

DuhCoin.createBlock(123, "UIJHDUGDG", "OKWOIJWHUG");

DuhCoin.createTransaction(100, "ALEXj8894zr4rz8", "JENNr487zr3849");

DuhCoin.createBlock(222, "988zr44r98", "UIHZZ89uh87");

DuhCoin.createTransaction(100, "ALEXj8894zr4rz8", "JENNr487zr3849");
DuhCoin.createTransaction(200, "ALEXj8894zr4rz8", "JENNr487zr3849");
DuhCoin.createTransaction(300, "ALEXj8894zr4rz8", "JENNr487zr3849");

DuhCoin.createBlock(566, "988zr44r98", "UIHZZ89uh87");

console.log(DuhCoin.chain[2]);
