import * as _ from 'lodash';
import {Transaction, TxIn, UnspentTxOut, validateTransaction} from './transaction';

let transactionPool = [];

const getTransactionPool = () => _.cloneDeep(transactionPool);

const addToTransactionPool = (tx, unspentTxOuts) => {
    if(!validateTransaction(tx, unspentTxOuts)) {
        throw Error('Trying to add invalid tx to pool');
    }

    //check if tx existed in transaction pool
    if(!isValidTxForPool(tx, transactionPool)) {
        throw Error('Trying to add invalid tx to pool');
    }
    console.log('adding to txPool: %s', JSON.stringify(tx));
    transactionPool.push(tx);
};

//check if TxIn is in unspentTxOuts
const hasTxIn = (txIn, unspentTxOuts) => {
    const foundTxIn = unspentTxOuts.find(uTxO => uTxO.txOutId === txIn.txOutId && uTxO.txOutIndex === txIn.txOutIndex);
    return foundTxIn !== undefined;
}

//when a new block is added to blockchain, we have to update tx pool because maybe there are invalid transaction
const updateTransactionPool = (unspentTxOuts) => {
    //search invalid transactions in current Tx Pool
    const invalidTxs = [];
    for (const tx of transactionPool) {
        for (const txIn of tx.txIns) {
            if(!hasTxIn(txIn, unspentTxOuts)) {
                invalidTxs.push(tx);
                break;
            }
        }
    }
    if(invalidTxs.length > 0) {
        console.log('removing the following transactions from txPool: %s', JSON.stringify(invalidTxs));
        transactionPool = _.without(transactionPool, ...invalidTxs);
    }
}

//get all Tx inputs in transaction pool
const getTxPoolIns = (aTransactionPool) => {
    return _(aTransactionPool)
        .map(tx => tx.txIns)
        .flatten()
        .value();
}

//check if tx existed in transaction pool, if yes return false.
const isValidTxForPool = (tx, aTransactionPool) => {
    const txPoolIns = getTxPoolIns(aTransactionPool);

    const containsTxIn = (txIns, txIn) => {
        return _.find(txIns, txPoolIn => txIn.txOutIndex === txPoolIn.txOutIndex && txIn.txOutId === txPoolIn.txOutId)
    }

    for (const txIn of tx.txIns) {
        if(containsTxIn(txPoolIns, txIn)) {
            console.log('txIn already found in the txPool');
            return false;
        }
    }
    return true;
};

module.exports = {
    addToTransactionPool, getTransactionPool, updateTransactionPool
};