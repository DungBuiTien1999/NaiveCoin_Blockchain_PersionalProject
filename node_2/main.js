"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const cors = require('cors')
const express = require("express");
const { add } = require("lodash");
const _ = require("lodash");
const blockchain_1 = require("./src/blockchain");
const p2p_1 = require("./src/p2p");
const transactionPool_1 = require("./src/transactionPool");
const wallet_1 = require("./src/wallet");
const httpPort = parseInt(process.env.HTTP_PORT) || 3002;
const p2pPort = parseInt(process.env.P2P_PORT) || 6002;
const initHttpServer = (myHttpPort) => {
    const app = express();
    app.use(cors())
    app.use(bodyParser.json());
    app.use((err, req, res, next) => {
        if (err) {
            res.status(400).send(err.message);
        }
    });
    app.get('/blocks', (req, res) => {
        res.send(blockchain_1.getBlockchain());
    });
    app.get('/myWallet', (req, res) => {
        const address = wallet_1.getPublicFromWallet();
        const balance = blockchain_1.getAccountBalance();
        res.json({address:address, balance:balance})
    });
    app.get('/block/:hash', (req, res) => {
        const block = _.find(blockchain_1.getBlockchain(), { 'hash': req.params.hash });
        res.send(block);
    });
    app.get('/transaction/:id', (req, res) => {
        const tx = _(blockchain_1.getBlockchain())
            .map((blocks) => blocks.data)
            .flatten()
            .find({ 'id': req.params.id });
        res.send(tx);
    });
    app.get('/address/:address', (req, res) => {
        const unspentTxOuts = _.filter(blockchain_1.getUnspentTxOuts(), (uTxO) => uTxO.address === req.params.address);
        res.send({ 'unspentTxOuts': unspentTxOuts });
    });
    app.get('/unspentTransactionOutputs', (req, res) => {
        res.send(blockchain_1.getUnspentTxOuts());
    });
    app.get('/myUnspentTransactionOutputs', (req, res) => {
        res.send(blockchain_1.getMyUnspentTransactionOutputs());
    });
    app.post('/mineRawBlock', (req, res) => {
        if (req.body.data == null) {
            res.send('data parameter is missing');
            return;
        }
        const newBlock = blockchain_1.generateRawNextBlock(req.body.data);
        if (newBlock === null) {
            res.status(400).send('could not generate block');
        }
        else {
            res.send(newBlock);
        }
    });
    app.post('/mineBlock', (req, res) => {
        const newBlock = blockchain_1.generateNextBlock();
        if (newBlock === null) {
            res.status(400).send('could not generate block');
        }
        else {
            res.send(newBlock);
        }
    });
    app.get('/balance', (req, res) => {
        const balance = blockchain_1.getAccountBalance();
        res.send({ 'balance': balance });
    });
    app.get('/address', (req, res) => {
        const address = wallet_1.getPublicFromWallet();
        res.send({ 'address': address });
    });
    app.post('/mineTransaction', (req, res) => {
        const address = req.body.address;
        const amount = req.body.amount;
        try {
            const resp = blockchain_1.generatenextBlockWithTransaction(address, amount);
            res.send(resp);
        }
        catch (e) {
            console.log(e.message);
            res.status(400).send(e.message);
        }
    });
    app.post('/sendTransaction', (req, res) => {
        try {
            const address = req.body.address;
            const amount = req.body.amount;
            if (address === undefined || amount === undefined) {
                throw Error('invalid address or amount');
            }
            const resp = blockchain_1.sendTransaction(address, Number(amount));
            res.send(resp);
        }
        catch (e) {
            console.log(e.message);
            res.status(400).send(e.message);
        }
    });
    app.get('/transactionPool', (req, res) => {
        res.send(transactionPool_1.getTransactionPool());
    });
    app.get('/peers', (req, res) => {
        res.send(p2p_1.getSockets().map((s) => s._socket.remoteAddress + ':' + s._socket.remotePort));
    });
    app.post('/addPeer', (req, res) => {
        p2p_1.connectToPeers(req.body.peer);
        res.send();
    });
    app.post('/connectWallet', (req, res) => {
        console.log("지갑 연결 요청옴")
        if (wallet_1.initWallet()){
            console.log("지갑 연결 요청옴22")
            res.send(true)
        }else {
            res.send(false)
        }
    });
    app.post('/stop', (req, res) => {
        res.send({ 'msg': 'stopping server' });
        process.exit();
    });
    app.listen(myHttpPort, () => {
        console.log('Listening http on port: ' + myHttpPort);
    });
};
initHttpServer(httpPort);
p2p_1.initP2PServer(p2pPort);
wallet_1.initWallet();

/*
    # Get blockchain (블록 목록 확인)
    curl http://localhost:3002/blocks | python3 -m json.tool
    # 
    curl http://localhost:3002/unspentTransactionOutputs | python3 -m json.tool
    # Get address
    curl http://localhost:3002/address | python3 -m json.tool

    # Mine a block (블록 채굴)
    curl -X POST http://localhost:3002/mineBlock | python3 -m json.tool

    # Send transaction (트랜잭션 전송)
    curl -H "Content-type: application/json" --data '{"address": "04bfcab8722991ae774db48f934ca79cfb7dd991229153b9f732ba5334aafcd8e7266e47076996b55a14bf9913ee3145ce0cfc1372ada8ada74bd287450313534b", "amount" : 10}' http://localhost:3002/sendTransaction | python3 -m json.tool
    curl -H "Content-type: application/json" --data '{"address": "04bfcab8722991ae774db48f934ca79cfb7dd991229153b9f732ba5334aafcd8e7266e47076996b55a14bf9913ee3145ce0cfc1372ada8ada74bd287450313534b", "amount" : 35}' http://localhost:3002/sendTransaction | python3 -m json.tool
    # Query transaction pool 트랜잭션 풀에 담긴 정보 확인
    curl http://localhost:3002/transactionPool | python3 -m json.tool

    # Mine transaction (트랜잭션 생성)
    curl -H "Content-type: application/json" --data '{"address": "04bfcab8722991ae774db48f934ca79cfb7dd991229153b9f732ba5334aafcd8e7266e47076996b55a14bf9913ee3145ce0cfc1372ada8ada74bd287450313534b", "amount" : 10}' http://localhost:3002/mineTransaction | python3 -m json.tool

    # Get balance (보유 금액 확인)
    curl http://localhost:3002/balance | python3 -m json.tool

    # Query information about a specific address (특정 주소에 대한 쿼리 정보)
    curl http://localhost:3002/address/04d6362b2ddcf8798dd009ee7743ae0a4e46506ca5076f1f5193b88a9a7ceb4f41e19422b456b092af52c16a7089c600acbe80e7df19ca8ec6f8c1d48c00578d60 | python3 -m json.tool

    # Add peer
    curl -H "Content-type:application/json" --data '{"peer" : "ws://localhost:6002"}' http://localhost:3002/addPeer | python3 -m json.tool

    # Query connected peers
    curl http://localhost:3002/peers


    코인베이스 트랜잭션 언제생성?
    블럭 채굴 했을 때
*/