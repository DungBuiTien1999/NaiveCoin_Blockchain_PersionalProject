const { ec } = require("elliptic");
// const { existsSync, readFileSync, unlinkSync, writeFileSync } = require("fs");
const fse = require('fs-extra');
const _ = require("lodash");
const {
  getPublicKey,
  getTransactionId,
  signTxIn,
  Transaction,
  TxIn,
  TxOut,
  UnspentTxOut,
} = require("./transaction");

const EC = new ec("secp256k1");

const privateKeyLocation = process.env.PRIVATE_KEY || "node/wallet/private_key";

const getPrivateFromWallet = () => {
  const buffer = fse.readFileSync(privateKeyLocation, "utf8");
  return buffer.toString();
};

const getPublicFromWallet = () => {
  const privateKey = getPrivateFromWallet();
  const key = EC.keyFromPrivate(privateKey, "hex");
  return key.getPublic().encode("hex");
};

const generatePrivateKey = () => {
  const keyPair = EC.genKeyPair();
  const privateKey = keyPair.getPrivate();
  return privateKey.toString(16);
};

const initWallet = () => {
  //let's not override existing private keys
  if (fse.existsSync(privateKeyLocation)) {
    return;
  }
  const newPrivateKey = generatePrivateKey();

  fse.writeFileSync(privateKeyLocation, newPrivateKey);
  console.log(
    "new wallet with private key created to : %s",
    privateKeyLocation
  );
};

const deleteWallet = () => {
  if (fse.existsSync(privateKeyLocation)) {
    fse.unlinkSync(privateKeyLocation);
  }
};

const getBalance = (address, unspentTxOuts) => {
  return _(findUnspentTxOuts(address, unspentTxOuts))
    .map((uTxO) => uTxO.amount)
    .sum();
};

const findUnspentTxOuts = (ownerAddress, unspentTxOuts) => {
  return _.filter(unspentTxOuts, (uTxO) => uTxO.address === ownerAddress);
};

//Find TxOuts in myUnspentTxOuts to be enough amount to send
const findTxOutsForAmount = (amount, myUnspentTxOuts) => {
  let currentAmount = 0;
  const includedUnspentTxOuts = [];
  for (const myUnspentOut of myUnspentTxOuts) {
    includedUnspentTxOuts.push(myUnspentOut);
    currentAmount += myUnspentOut.amount;
    if (currentAmount >= amount) {
      const leftOverAmount = currentAmount - amount;
      return { includedUnspentTxOuts, leftOverAmount };
    }
  }

  const eMsg =
    "Cannot create transaction from the available unspent transaction outputs." +
    " Required amount:" +
    amount +
    ". Available unspentTxOuts:" +
    JSON.stringify(myUnspentTxOuts);
  throw Error(eMsg);
};

//this method is called when you send coin for other
const createTxOuts = (receiverAddress, myAddress, amount, leftOverAmount) => {
  const txOut1 = new TxOut(receiverAddress, amount);
  if (leftOverAmount == 0) {
    return [txOut1];
  } else {
    const leftOverTx = new TxOut(myAddress, leftOverAmount);
    return [txOut1, leftOverTx];
  }
};

//this method is used to remove all unspent transaction used (tx inputs in txPool)
const filterTxPoolTxs = (unspentTxOuts, transactionPool) => {
  const txIns = _(transactionPool)
    .map((tx) => tx.txIns)
    .flatten()
    .value();
  const removable = [];
  for (const unspentTxOut of unspentTxOuts) {
    const txIn = _.find(
      txIns,
      (aTxIns) =>
        aTxIn.txOutIndex === unspentTxOut.txOutIndex &&
        aTxIn.txOutId === unspentTxOut.txOutId
    );

    if (txIn !== undefined) {
      removable.push(unspentTxOut);
    }
  }
  return _.without(unspentTxOuts, ...removable);
};

const createTransaction = (
  receiverAddress,
  amount,
  privateKey,
  unspentTxOuts,
  txPool
) => {
    console.log('txPool: %s', JSON.stringify(txPool));
    const myAddress = getPublicKey(privateKey);
    const myUnspentTxOutsA = unspentTxOuts.filter(uTxO => uTxO.address === myAddress);

    const myUnspenttxOuts = filterTxPoolTxs(myUnspentTxOutsA, txPool);

    // filter from unspentOutputs such inputs that are referenced in pool
    const {includedUnspentTxOuts, leftOverAmount} = findTxOutsForAmount(amount, myUnspenttxOuts);

    const toUnsignedTxIn = (unspentTxOut) => {
        const txIn = new TxIn();
        txIn.txOutId = unspentTxOut.txOutId;
        txIn.txOutIndex = unspentTxOut.txOutIndex;
        return txIn;
    };

    const unsignedtxIns = includedUnspentTxOuts.map(toUnsignedTxIn);

    const tx = new Transaction();
    tx.txIns = unsignedtxIns;
    tx.txOuts = createTxOuts(receiverAddress, myAddress, amount, leftOverAmount);
    tx.id = getTransactionId(tx);

    tx.txIns = tx.txIns.map((txIn, index) => {
        txIn.signature = signTxIn(tx, index, privateKey, unspentTxOuts);
        return txIn;
    });
    
    return tx;
};

module.exports = {
    createTransaction, getPublicFromWallet,
    getPrivateFromWallet, getBalance, generatePrivateKey, initWallet, deleteWallet, findUnspentTxOuts
}