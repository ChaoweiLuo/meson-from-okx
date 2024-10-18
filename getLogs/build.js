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
      const logs = await provider.getLogs({ fromBlock: Math.max(0, blockNumber - 1000), toBlock: blockNumber, address: mesonContract })
      console.log(blockNumber, logs.length)
      for (const log of logs) {
        await getTransaction(log.transactionHash)
      }
      blockNumber = blockNumber - 1000
    }
  }

  async function getTransaction (hash) {
    const provider = new ethers.providers.JsonRpcProvider(rpc.url);
    const tx = await provider.getTransaction(hash)
    if(!tx) console.log('not found', hash)
    if (String(tx?.to).toLowerCase() === okxContract) {
      col.findOneAndUpdate({ _id: tx.hash }, { $set: tx }, { upsert: true })
      console.log('find ', ++count);
    }
    return { tx };
  }
  
  return getLogs
}
