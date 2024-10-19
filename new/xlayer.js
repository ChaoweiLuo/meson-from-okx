import { ethers } from "ethers";

const okxContract = '0x5965851f21dae82ea7c62f87fb7c57172e9f2add';
const mesonContract = `0x25aB3Efd52e6470681CE037cD546Dc60726948D3`.toLowerCase()
const rpc = { "network": "xlayer", "url": "https://xlayerrpc.okx.com", "type": "http" }

const xlayerBlockCount = 3600 * 24 / 3;

let count = 0, total = 0;

async function getLogs () {
  const provider = new ethers.providers.JsonRpcProvider(rpc.url);
  let blockNumber = await provider.getBlockNumber();
  let minBlockNumber = blockNumber - xlayerBlockCount;
  while (blockNumber > minBlockNumber) {
    const logs = await provider.getLogs({ fromBlock: Math.max(minBlockNumber, blockNumber - 1000), toBlock: blockNumber, address: okxContract })
    total += logs.length
    console.log('blockNumber:', blockNumber, 'logs:', logs.length, "total", total, "count", count)
    for (const log of logs) {
      await getTransactionReceipt(log.transactionHash)
    }
    blockNumber = blockNumber - 1000
  }
  console.log('total:', total, 'count:', count)
}

async function getTransactionReceipt (hash) {
  const provider = new ethers.providers.JsonRpcProvider(rpc.url);
  const tx = await provider.getTransactionReceipt(hash)
  if (!tx) console.log('not found', hash)
  const mesonLog = tx.logs.find(x => x.address.toLowerCase() === mesonContract)
  if (!!mesonLog) {
    console.log('find ', ++count);
    tx.hasMeson = true
  }
  return { tx };
}

await getLogs()