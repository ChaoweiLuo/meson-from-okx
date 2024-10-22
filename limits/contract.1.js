import { ethers } from "ethers";
import db from '../db.js';
const col = db.collection('limit-contract-1');
let total = 0;
export async function getResult ({ token, okxContract, mesonContract, rpc, blockCount, blockNumber = 5632448 } = {}) {
  console.time('contract.0')
  const provider = new ethers.providers.JsonRpcProvider(rpc.url);
  const abi = [
    "function balanceOf(address) view returns (uint256)",
    "function Transfer(address from, address to, uint256 amount)",
    "event Transfer(address indexed from, address indexed to, uint256 amount)"
  ];
  
  const contract = new ethers.Contract(token, abi, provider);
  const filter = contract.filters.Transfer(null, null);
  let minBlockNumber = blockNumber - blockCount;
  while (blockNumber > minBlockNumber) {
    const events = await contract.queryFilter(filter, Math.max(minBlockNumber, blockNumber - 1000), blockNumber);
    total += events.length
    console.log('blockNumber:', blockNumber, 'events:', events.length, total)
    for (const event of events) {
      await handleEvent(event);
    }
    blockNumber = blockNumber - 1000
  }

  async function handleEvent (event) {
    let receipt = await col.findOne({ transactionHash: event.transactionHash })
    if (!receipt) {
      receipt = await event.getTransactionReceipt();
      if (!receipt) { return; }
      if (String(receipt.to).toLowerCase() === okxContract) {
        receipt.isToOkx = true;
      }
      if (receipt.logs?.find(log => log.address.toLowerCase() === okxContract)) {
        receipt.isOkxLog = true;
      }
      if (receipt.logs?.find(log => log.address.toLowerCase() === mesonContract)) {
        receipt.isMesonLog = true
      }
      console.log('contract.1', receipt.isToOkx, receipt.isOkxLog)
      if (receipt.isToOkx || receipt.isOkxLog) await col.insertOne(receipt);
    }

  }
  return total;
}
