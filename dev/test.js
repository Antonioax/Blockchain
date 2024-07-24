const Blockchain = require("./blockchain");

const DuhCoin = new Blockchain();

const previousBlockHash = "9i3e8u3ezue3zz387";
const currentBlockData = [
  { amount: 10, sender: "83e38eu8u3e", recipient: "u9u9e8u893e" },
  { amount: 20, sender: "83e38eu8u3e", recipient: "u9u9e8u893e" },
  { amount: 30, sender: "83e38eu8u3e", recipient: "u9u9e8u893e" },
];
const nonce = 114460;

console.log(DuhCoin.hashBlock(previousBlockHash, currentBlockData, nonce));
