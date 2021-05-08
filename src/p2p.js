const WebSocket = require('ws');
import {Server} from 'ws';
import {
    addBlockToChain, Block, getBlockchain, getLatestBlock, handleReceivedTransaction, isValidBlockStructure,
    replaceChain
} from './blockchain';
import {Transaction} from './transaction';
import {getTransactionPool} from './transactionPool';
