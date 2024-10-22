
import { ethers } from "ethers";
import { createWriteStream } from "fs";
import { writeFile } from 'fs/promises'



export const topics = [
  '0xf6481cbc1da19356c5cb6b884be507da735b89f21dc4bbb7c9b7cc0968b03b7a',
  '0xb9dae57db52a734b183c77227c96068231beb6a93a060ca7a9d3164f716714ea'
]
export async function getResult ({ token, rpc, okxContract, mesonContract, endBlock, startBlock, withTopic } = {}) {

  let total = 0, toOkxCount = 0, hasTokenLogCount = 0, hasOkxLogCount = 0, toOkx_hasTokenLog_count = 0, errorCount = 0;
  const list = [];
  const withTokenMap = {};
  
  const provider = new ethers.providers.JsonRpcProvider(rpc.url);
  let currentBlock = endBlock;
  while (currentBlock > startBlock) {
    const logs = await provider.getLogs({
      fromBlock: Math.max(startBlock, currentBlock - 1000),
      toBlock: currentBlock,
      address: okxContract,
      topics: [withTopic]
    })
    list.push(...logs);
    total += logs.length;
    console.log('log', total)
    for (const log of logs) {
      await handleLog(log)
    }
    currentBlock = currentBlock - 1000
  }
  async function handleLog (log) {
    const provider = new ethers.providers.JsonRpcProvider(rpc.url);
    const receipt = await provider.getTransactionReceipt(log.transactionHash)
    if (!receipt) {
      errorCount++;
      return console.log('not found', log.transactionHash)
    }
    const tokenLog = receipt.logs.find(log => log.address.toLowerCase() === token)
    const isToOkx = receipt.to.toLowerCase() === okxContract;
    const okxLog = receipt.logs.find(log => log.address.toLowerCase() === okxContract)
    receipt.isToOkx = isToOkx;
    receipt.withOkxLog = !!okxLog;
    receipt.withToken = !!tokenLog;
    if (tokenLog) {
      hasTokenLogCount++
      if (isToOkx) toOkx_hasTokenLog_count++;
      const tx = await provider.getTransaction(log.transactionHash);
      const method = tx.data.slice(0, 10);
      withTokenMap[method] = withTokenMap[method] || [];
      const item = {
        hash: log.transactionHash,
        isToOkx,
        hasOkxLog: !!okxLog
      }
      withTokenMap[method].push(item);
      receipt.method = method;
    }
    if (isToOkx) toOkxCount++;
    if (!!okxLog) hasOkxLogCount++;
  }

  const listFileName = `log-list-${Date.now()}.json`, statsFileName = `log-stats-${Date.now()}.json`;
  createWriteStream(listFileName).write(JSON.stringify(list))
  createWriteStream(statsFileName).write(JSON.stringify(withTokenMap))
  return { total, hasTokenLogCount, error_count: errorCount, toOkxCount, hasOkxLogCount, toOkx_hasTokenLog_count }
}

