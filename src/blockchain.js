const CryptoJS = require("crypto-js");
const _ = require("lodash");

import {
    getCoinbaseTransaction, isValidAddress, processTransactions, Transaction, UnspentTxOut
} from './transaction';
import {hexToBinary} from './util';
import {broadcastLatest, broadCastTransactionPool} from './p2p';
import {createTransaction, findUnspentTxOuts, getBalance, getPrivateFromWallet, getPublicFromWallet} from './wallet';

class Block {
    constructor(index, hash, previousHash, timestamp, data, difficulty, nonce) {
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.difficulty = difficulty;
        this.nonce = nonce;
    }
}

const genesisTransaction = {
    'txIns': [{'txOutId': 0, 'txOutIndex': '', 'signature': ''}],
    'txOuts': [{
        'address': '04bfcab8722991ae774db48f934ca79cfb7dd991229153b9f732ba5334aafcd8e7266e47076996b55a14bf9913ee3145ce0cfc1372ada8ada74bd287450313534a',
        'amount': 50
    }],
    'id': 'e655f6a5f26dc9b4cac6e46f52336428287759cf81ef5ff10854f69d68f43fa3'
}

const genesisBlock = new Block(0, '91a73664bc84c0baa1fc75ea6e4aa6d1d20c5df664c724e3159aefc2e1186627', '', 1465154705,[genesisTransaction], 0, 0);

let blockchain = [genesisBlock];

// the unspent txOut of genesis block is set to unspentTxOuts on startup
let unspentTxOuts = processTransactions(blockchain[0].data, [], 0);

const getBlockchain = () => blockchain;

const getUnspentTxOuts = () => unspentTxOuts;

//modify unspentTxOuts when a new block is added
const setUnspentTxOuts = (newUnspentTxOuts) => {
    console.log('replacing unspentTxouts with: %s', newUnspentTxOut);
    unspentTxOuts = newUnspentTxOuts;
}

const getLastestBlock = () => blockchain[blockchain.length - 1];

// in seconds
const BLOCK_GENERATION_INTERVAL = 10;

// in blocks
const DIFFICULTY_ADJUSTMENT_INTERVAL = 10;

const getDifficulty = (aBlockchain) => {
    const lastestBlock = aBlockchain[aBlockchain - 1];
    if(lastestBlock.index % DIFFICULTY_ADJUSTMENT_INTERVAL === 0 && lastestBlock.index !== 0) {
        return getAdjustedDifficulty(lastestBlock, aBlockchain);
    } else {
        return lastestBlock.difficulty;
    }
};

const getAdjustedDifficulty = (lastestBlock, aBlockchain) => {
    const prevAdjustmentBlock = aBlockchain[blockchain.length - DIFFICULTY_ADJUSTMENT_INTERVAL];
    const timeExpected = BLOCK_GENERATION_INTERVAL*DIFFICULTY_ADJUSTMENT_INTERVAL;
    const timeTaken = lastestBlock.timestamp - prevAdjustmentBlock.timestamp;
    if(timeTaken < timeExpected/2) {
        return prevAdjustmentBlock.difficulty + 1;
    }else if(timeTaken > timeExpected*2) {
        return prevAdjustmentBlock.difficulty - 1;
    } else {
        return prevAdjustmentBlock.difficulty;
    }
};

const getCurrentTimestamp = () => Math.round(new Date().getTime() / 1000);

//create a new block in blockchain
const generateRawNextBlock = (blockData) => {
    const previousBlock = getLastestBlock();
    const difficulty = getDifficulty(getBlockchain());
    const nextIndex = previousBlock.index + 1;
    const nextTimestamp = getCurrentTimestamp();
    const newBlock = findBlock(nextIndex, previousBlock.hash, nextTimestamp, blockData, difficulty);
    if(addBlockToChain(newBlock)) {
        broadcastLatest();
        return newBlock;
    } else {
        return null;
    }
}

// gets the unspent transaction outputs owned by the wallet
const getMyUnspentTransactionOutputs = () => findUnspentTxOuts(getPublicFromWallet(), getUnspentTxOuts());

//Create a new block with coinbaseTx and transactions in the transaction pool
const generateNextBlock = () => {
    const coinbaseTx = getCoinbaseTransaction(getPublicFromWallet(), getLastestBlock().index + 1);
    const blockData = [coinbaseTx].concat(getTransactionPool());
    return generateRawNextBlock(blockData);
}

const generatenextBlockWithTransaction = (receiverAddress, amount) => {
    if(!isValidAddress(receiverAddress)) {
        throw Error('invalid address');
    }
    if(typeof amount !== 'number') {
        throw Error('invalid amount');
    }
    const coinbaseTx = getCoinbaseTransaction(getPublicFromWallet(), getLastestBlock().index + 1);
    const tx = createTransaction(receiverAddress, amount, getPrivateFromWallet(), getUnspentTxOuts(), getTransactionPool());
    const blockData = [coinbaseTx, tx];
    return generateRawNextBlock(blockData);
}

const findBlock = (index, previousHash, timestamp, data, difficulty) => {
    let nonce = 0;
    while(true) {
        const hash = calculateHash(index, previousHash, timestamp, data, difficulty, nonce);
        if(hashMatchesDifficulty(hash, difficulty)) {
            return new Block(index, hash, previousHash, timestamp, data, difficulty, nonce);
        }
        nonce++;
    }
};