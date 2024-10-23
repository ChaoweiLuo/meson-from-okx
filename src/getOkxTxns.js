import { ethers } from "ethers";


export const topicMap = {
  swapBridgeToV2: "0xb9dae57db52a734b183c77227c96068231beb6a93a060ca7a9d3164f716714ea",
  bridgeToV2: "0xf6481cbc1da19356c5cb6b884be507da735b89f21dc4bbb7c9b7cc0968b03b7a"
}

export async function getOkxTxns ({ token, rpc, okxContract, endBlock, startBlock, topic } = {}) {
  let total = 0, toOkxCount = 0, hasTokenLogCount = 0, hasOkxLogCount = 0, toOkxAndHasTokenLogCount = 0;
  const receiptList = [];
  const txHashByMethods = {};
  const noneReceiptHashList = [];

  const provider = new ethers.providers.JsonRpcProvider(rpc.url);
  let currentBlock = endBlock;
  while (currentBlock > startBlock) {
    const logs = await provider.getLogs({
      fromBlock: Math.max(startBlock, currentBlock - 1000),
      toBlock: currentBlock,
      address: okxContract,
      topics: [topic]
    })
    receiptList.push(...logs);
    total += logs.length;
    for (const log of logs) {
      await handleLog(log)
    }
    currentBlock = currentBlock - 1000
  }
  async function handleLog (log) {
    const provider = new ethers.providers.JsonRpcProvider(rpc.url);
    const receipt = await provider.getTransactionReceipt(log.transactionHash)
    if (!receipt) return noneReceiptHashList.push(log.transactionHash);
    const tokenLog = receipt.logs.find(log => log.address.toLowerCase() === token)
    const isToOkx = receipt.to.toLowerCase() === okxContract;
    const okxLog = receipt.logs.find(log => log.address.toLowerCase() === okxContract)
    receipt.isToOkx = isToOkx;
    receipt.withOkxLog = !!okxLog;
    receipt.withToken = !!tokenLog;
    if (tokenLog) {
      hasTokenLogCount++
      if (isToOkx) toOkxAndHasTokenLogCount++;
      const tx = await provider.getTransaction(log.transactionHash);
      const method = tx.data.slice(0, 10);
      txHashByMethods[method] = txHashByMethods[method] || [];
      const item = {
        hash: log.transactionHash,
        "to=okx": isToOkx,
        "logs.includes(okx)": !!okxLog
      }
      txHashByMethods[method].push(item);
      receipt.method = method;
    }
    if (isToOkx) toOkxCount++;
    if (!!okxLog) hasOkxLogCount++;
  }
  const counts = {
    total,
    hasTokenLogCount,
    hasOkxLogCount,
    toOkxCount,
    toOkxAndHasTokenLogCount
  }
  return { receiptList, txHashByMethods, noneReceiptHashList, counts }
}