import { ethers } from "ethers";
const rpc = { "network": "scroll", "url": "https://rpc.ankr.com/scroll", "type": "http" }

const mesonContract = `0x25aB3Efd52e6470681CE037cD546Dc60726948D3`.toLowerCase()
const okxContract = `0xad7c9ca9d558f72dc15cbb33ec7002fba5f332a3`.toLowerCase()
const usdt = `0xf55bec9cafdbe8730f096aa55dad6d22d44099df`.toLowerCase()
// udsc 
const provider = new ethers.providers.JsonRpcProvider(rpc.url);

const abi = [
  "function balanceOf(address) view returns (uint256)",
  "function Transfer(address from, address to, uint256 amount)",
  "event Transfer(address indexed from, address indexed to, uint256 amount)"
];

const contract = new ethers.Contract(okxContract, abi, provider);
let total = 0, count = 0
setInterval(() => {
  console.log('count', count, 'total', total)
}, 5000);
const filter = contract.filters.Transfer(okxContract);
let blockNumber = await provider.getBlockNumber();

void async function getLogs () {
  const trans = await contract.queryFilter(filter, blockNumber - 10000, blockNumber)
  console.log(trans.length, blockNumber)
  total += trans.length
  for (const transaction of trans) {
    const receipt = await transaction.getTransactionReceipt()
    const mesonLog = receipt.logs.find(x => x.address.toLowerCase() === mesonContract)
    const okxLog = receipt.logs.find(x => x.address.toLowerCase() === okxContract)
    if (mesonLog && okxLog) {
      console.log(total, ++count)
    }
  }
  blockNumber = blockNumber - 1000
  if (blockNumber > 0) {
    getLogs()
  }
}()
console.log('done')
