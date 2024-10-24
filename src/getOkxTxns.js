import { ethers } from "ethers";


export const topicMap = {
  swapBridgeToV2: "0xb9dae57db52a734b183c77227c96068231beb6a93a060ca7a9d3164f716714ea",
  bridgeToV2: "0xf6481cbc1da19356c5cb6b884be507da735b89f21dc4bbb7c9b7cc0968b03b7a"
}

export async function getOkxTxns ({ tokens, rpc, okxContract, endBlock, startBlock } = {}) {
  let total = 0, hasOkxLogCount = 0;
  const receiptList = [];
  const txHashByMethods = {};

  const provider = new ethers.providers.JsonRpcProvider(rpc.url);
  let currentBlock = endBlock;
  while (currentBlock > startBlock) {
    const logs = await provider.getLogs({
      fromBlock: Math.max(startBlock, currentBlock - 1000),
      toBlock: currentBlock,
      address: okxContract
    })
    for (const log of logs) {
      await handleLog(log)
    }
    currentBlock = currentBlock - 1000
  }
  async function handleLog (log) {
    if(receiptList.find(x => x.transactionHash === log.transactionHash)) return;
    total++;
    const provider = new ethers.providers.JsonRpcProvider(rpc.url);
    const receipt = await provider.getTransactionReceipt(log.transactionHash)
    if (!receipt) return;
    receiptList.push(receipt);
    for (const tokenName in tokens) {
      const token = tokens[tokenName];
      const tokenLog = receipt.logs.find(log => log.address.toLowerCase() === token)
      receipt[tokenName] = !!tokenLog;
    }
    let okxMethods = receipt.logs
      .filter(log => log.address.toLowerCase() === okxContract)
      .map(x => x.topics[0])
      .map(topic => topicMap[topic] || topic);
    okxMethods = Array.from(new Set(okxMethods));
    if(okxMethods.length) {
      receipt.okxMethods = okxMethods;
      hasOkxLogCount++;
    }
  }
  const counts = {
    total,
    hasOkxLogCount,
  }
  return { receiptList, txHashByMethods, counts }
}