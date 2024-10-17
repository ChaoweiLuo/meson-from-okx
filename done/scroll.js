import { ethers } from 'ethers';
import db from './db.js'
const col = db.collection("scroll")

const rpc = { "network": "scroll", "url": "https://rpc.ankr.com/scroll", "type": "http" }

const mesonContract = `0x25aB3Efd52e6470681CE037cD546Dc60726948D3`.toLowerCase()
const okxContract = `0x3335733c454805df6a77f825f266e136FB4a3333`.toLowerCase()

let count = 0;
// 最后一次同步区块是： 7777000
// 如果需要继续往前同步就从 7777000 开始
async function getLogs() {
  const provider = new ethers.providers.JsonRpcProvider(rpc.url);
  let blockNumber = 7777000 // await provider.getBlockNumber();
  console.log(blockNumber)
  while (blockNumber > 0) {
    const logs = await provider.getLogs({ fromBlock: blockNumber - 1000, toBlock: blockNumber , address: mesonContract })
    console.log(blockNumber, logs.length)
    for (const log of logs) {
      await getTransaction(log.transactionHash)
    }
    blockNumber = blockNumber - 1000
  }
}

async function  getTransaction(hash) {
  const provider = new ethers.providers.JsonRpcProvider(rpc.url);
  const tx = await provider.getTransaction(hash)
  // const receipt = await provider.getTransactionReceipt(hash);
  if(String(tx.to).toLowerCase() === okxContract) {
    col.findOneAndUpdate({ _id: tx.hash}, { $set: tx }, { upsert: true })
    console.log('find ', ++count);
  }
  return { tx };
}

async function getBalance() {
  const provider = new ethers.providers.JsonRpcProvider(rpc.url);
  const balance = await provider.getBalance(`0x9Bf90dFf0Db4dcA34846f53a79D22819A31FBC6C`)
  console.log(balance)
}

void async function main() {
  await getLogs()
}()