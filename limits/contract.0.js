import { ethers } from "ethers";

export async function getResult ({ token, okxContract, rpc, startBlock, endBlock = 5632448 } = {}) {
  let total = 0, toOkxCount = 0, hasOkxLogCount = 0, errorCount = 0;
  const list = [];
  const methodMap = {};

  const provider = new ethers.providers.JsonRpcProvider(rpc.url);
  const abi = [
    "function balanceOf(address) view returns (uint256)",
    "function Transfer(address from, address to, uint256 amount)",
    "event Transfer(address indexed from, address indexed to, uint256 amount)"
  ];

  const contract = new ethers.Contract(token, abi, provider);
  const filter = contract.filters.Transfer(null, okxContract);
  let currentBlock = endBlock;
  while (currentBlock > startBlock) {
    const events = await contract.queryFilter(filter, Math.max(startBlock, currentBlock - 1000), currentBlock);
    total += events.length;
    console.log('blockNumber:', currentBlock, 'events:', events.length, total)
    for (const event of events) {
      await handleEvent(event)
    }
    currentBlock = currentBlock - 1000
  }

  async function handleEvent (event) {
    const rps = event.getTransactionReceipt();
    const tps = event.getTransaction()
    const [receipt, tx] = await Promise.all([rps, tps]);
    if (!receipt) {
      errorCount++;
      return;
    }
    if (String(receipt.to).toLowerCase() === okxContract) {
      receipt.isToOkx = true;
      toOkxCount++;
      const method = tx.data.slice(0, 10);
      methodMap[method] = methodMap[method] || []
      methodMap[method].push({
        hash: event.transactionHash,
        "ogs.includes(okx)": receipt.hasOkxLog,
        "to=okx": receipt.isToOkx
      })
      receipt.method = method;
    }
    if (receipt.logs?.find(log => log.address.toLowerCase() === okxContract)) {
      receipt.hasOkxLog = true;
      hasOkxLogCount++;
    }

    list.push(receipt)
  }

  return { total, toOkxCount, hasOkxLogCount, methodMap, list }
}
