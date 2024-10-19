
import { ethers } from "ethers";


export function build (rpc, okxContract, mesonContract, blockCount) {
  let count = 0, total = 0;
  async function getLogs (token) {
    const provider = new ethers.providers.JsonRpcProvider(rpc.url);
    let blockNumber = await provider.getBlockNumber();
    let minBlockNumber = blockNumber - blockCount;
    while (blockNumber > minBlockNumber) {
      const logs = await provider.getLogs({
        fromBlock: Math.max(minBlockNumber, blockNumber - 1000),
        toBlock: blockNumber,
        address: token
      })
      console.log(rpc.network, 'blockNumber:', blockNumber, 'logs:', logs.length, "total", total, "count", count, token)
      for (const log of logs) {
        await getTransactionReceipt(log.transactionHash)
      }
      blockNumber = blockNumber - 1000
    }
    console.log(rpc.network, 'total:', total, 'count:', count, token)
    return { network: rpc.network, total, count, token }
  }

  async function getTransactionReceipt (hash) {
    const provider = new ethers.providers.JsonRpcProvider(rpc.url);
    const tx = await provider.getTransactionReceipt(hash)
    if (!tx) console.log('not found', hash)
    if (String(tx.to).toLowerCase() === okxContract) {
      total++;
      const mesonLog = tx.logs.find(x => x.address.toLowerCase() === mesonContract)
      if (!!mesonLog) {
        count ++;
        console.log(rpc.network, 'find ', count);
      }
    }
  }
  return async function (token) {
    try {
      return await getLogs(token);
    } catch (err) {
      console.error('error from ', rpc.network);
      console.log(err);
      return { network: rpc.network, total, count }
    }
  }
}
