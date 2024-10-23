import { ethers } from "ethers";

export async function getTransferTxns ({ token, okxContract, rpc, startBlock, endBlock, toOkx = false } = {}) {
  let total = 0, toOkxCount = 0, hasOkxLogCount = 0;
  const receiptList = [];
  const txHashByMethods = {};
  const noneReceiptHashList = [];

  const provider = new ethers.providers.JsonRpcProvider(rpc.url);
  const abi = [
    "function balanceOf(address) view returns (uint256)",
    "function Transfer(address from, address to, uint256 amount)",
    "event Transfer(address indexed from, address indexed to, uint256 amount)"
  ];

  const contract = new ethers.Contract(token, abi, provider);
  const filter = contract.filters.Transfer(null, toOkx ? okxContract : null);
  let currentBlock = endBlock;
  while (currentBlock > startBlock) {
    const events = await contract.queryFilter(filter, Math.max(startBlock, currentBlock - 1000), currentBlock);
    // total += events.length;
    for (const event of events) {
      await handleEvent(event)
    }
    currentBlock = currentBlock - 1000
  }

  async function handleEvent (event) {
    // 存在重复查询出同一笔交易的情况
    if (receiptList.find(x => x.transactionHash === event.transactionHash)) return;
    total++;
    const rps = event.getTransactionReceipt();
    const tps = event.getTransaction()
    const [receipt, tx] = await Promise.all([rps, tps]);
    if (!receipt) {
      noneReceiptHashList.push(event.transactionHash);
      return;
    }
    if (receipt.logs?.find(log => log.address.toLowerCase() === okxContract)) {
      receipt.hasOkxLog = true;
      hasOkxLogCount++;
    }
    if (String(receipt.to).toLowerCase() === okxContract) {
      receipt.isToOkx = true;
      toOkxCount++;
      const method = tx.data.slice(0, 10);
      txHashByMethods[method] = txHashByMethods[method] || []
      txHashByMethods[method].push({
        hash: event.transactionHash,
        "logs.includes(okx)": receipt.hasOkxLog,
        "to=okx": receipt.isToOkx
      })
      receipt.method = method;
    }

    receiptList.push(receipt)
  }

  return { noneReceiptHashList, txHashByMethods, receiptList, counts: { total, toOkxCount, hasOkxLogCount } }
}
