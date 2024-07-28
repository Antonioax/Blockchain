const Blockchain = require("./blockchain");

const duhCoin = new Blockchain();

const dc1 = {
  chain: [
    {
      index: 1,
      timestamp: 1722186820929,
      transactions: [],
      nonce: 0,
      hash: "0",
      previousBlockHash: "0",
    },
    {
      index: 2,
      timestamp: 1722186848891,
      transactions: [],
      nonce: 18140,
      hash: "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
      previousBlockHash: "0",
    },
    {
      index: 3,
      timestamp: 1722186852052,
      transactions: [
        {
          id: "cd2c38904d0411efb8b0ff1b34544189",
          amount: 1,
          sender: "00",
          recipient: "bc7cfb104d0411efb8b0ff1b34544189",
        },
      ],
      nonce: 7363,
      hash: "0000b9ea093cb5e69a2ddd9f47d4604ec262297225e9218858bc9ad4a29a66b5",
      previousBlockHash:
        "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
    },
    {
      index: 4,
      timestamp: 1722186916333,
      transactions: [
        {
          id: "cf0a6e704d0411efb8b0ff1b34544189",
          amount: 1,
          sender: "00",
          recipient: "bc7cfb104d0411efb8b0ff1b34544189",
        },
        {
          id: "e48b31304d0411efb8b0ff1b34544189",
          amount: "100",
          sender: "ANTONIO",
          recipient: "MUP",
        },
        {
          id: "e5ccd8f04d0411efb8b0ff1b34544189",
          amount: "100",
          sender: "ANTONIO",
          recipient: "MUP",
        },
        {
          id: "e632c6b04d0411efb8b0ff1b34544189",
          amount: "100",
          sender: "ANTONIO",
          recipient: "MUP",
        },
      ],
      nonce: 26696,
      hash: "000042563d6a350c8a468999f081bcfaf6ff29fc649a9ab79966a9815ee7a9a0",
      previousBlockHash:
        "0000b9ea093cb5e69a2ddd9f47d4604ec262297225e9218858bc9ad4a29a66b5",
    },
    {
      index: 5,
      timestamp: 1722186934276,
      transactions: [
        {
          id: "f55aef004d0411efb8b0ff1b34544189",
          amount: 1,
          sender: "00",
          recipient: "bc7cfb104d0411efb8b0ff1b34544189",
        },
      ],
      nonce: 106269,
      hash: "0000f2e71d71dc67f4d85c4abd118e979cd470ea94e2f8de246d084850dafe4b",
      previousBlockHash:
        "000042563d6a350c8a468999f081bcfaf6ff29fc649a9ab79966a9815ee7a9a0",
    },
    {
      index: 6,
      timestamp: 1722186936439,
      transactions: [
        {
          id: "000cd1704d0511efb8b0ff1b34544189",
          amount: 1,
          sender: "00",
          recipient: "bc7cfb104d0411efb8b0ff1b34544189",
        },
      ],
      nonce: 41504,
      hash: "000016bf5a874ce8a2fb6984941f9640c3862263810278744ac1ab8936a9d814",
      previousBlockHash:
        "0000f2e71d71dc67f4d85c4abd118e979cd470ea94e2f8de246d084850dafe4b",
    },
  ],
  pendingTransactions: [
    {
      id: "0156b6904d0511efb8b0ff1b34544189",
      amount: 1,
      sender: "00",
      recipient: "bc7cfb104d0411efb8b0ff1b34544189",
    },
  ],
  currentNodeUrl: "http://localhost:3001",
  networkNodes: [],
};

console.log(duhCoin.isValid(dc1.chain));
