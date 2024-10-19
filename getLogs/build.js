import { ethers } from "ethers";

import db from './db.js'

export default function build (colName, rpc, okxContract, mesonContract, startBlock) {

  const col = db.collection(colName);
  let count = 0;

  async function getLogs () {
    const provider = new ethers.providers.JsonRpcProvider(rpc.url);
    let blockNumber = startBlock || await provider.getBlockNumber();
    console.log(blockNumber)
    while (blockNumber > 0) {
      const logs = await provider.getLogs({ fromBlock: Math.max(0, blockNumber - 1000), toBlock: blockNumber, address: okxContract })
      console.log(blockNumber, logs.length)
      for (const log of logs) {
        await getTransaction(log.transactionHash)
      }
      blockNumber = blockNumber - 1000
    }
  }

  async function getTransaction (hash) {
    const provider = new ethers.providers.JsonRpcProvider(rpc.url);
    const tx = await provider.getTransactionReceipt(hash)
    if(!tx) console.log('not found', hash)
    const mesonLog = tx.logs.find(x => x.address.toLowerCase() === mesonContract)
    if (!!mesonLog) {
      console.log('find ', ++count);
      tx.hasMeson = true
    }
    col.findOneAndUpdate({ _id: tx.hash }, { $set: tx }, { upsert: true })
    return { tx };
  }
  
  return getLogs
}
