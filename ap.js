import { ethers } from "ethers";
const rpc = { "network": "scroll", "url": "https://rpc.ankr.com/scroll", "type": "http" }

const mesonContract = `0x25aB3Efd52e6470681CE037cD546Dc60726948D3`.toLowerCase()
const okxContract = `0x3335733c454805df6a77f825f266e136FB4a3333`.toLowerCase()
const usdt = `0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df`.toLowerCase()
const usdc = `0x1D738a3436A8C49CefFbaB7fbF04B660fb528CbD`.toLowerCase()

const provider = new ethers.providers.JsonRpcProvider(rpc.url);

const abi = [
  "function balanceOf(address) view returns (uint256)",
  "function Transfer(address from, address to, uint256 amount)",
  "event Transfer(address indexed from, address indexed to, uint256 amount)",
  "event Approval(address indexed owner, address indexed spender, uint value)",
];

const contract = new ethers.Contract(usdc, abi, provider);
let total = 0, count = 0

const filter = contract.filters.Transfer(okxContract);
let blockNumber = await provider.getBlockNumber();
console.log('filter', blockNumber, filter)
void async function getLogs () {
  const trans = await contract.queryFilter(filter, blockNumber - 10000, blockNumber)
  console.log(trans.length, blockNumber, count, total)
  total += trans.length
  for (const transaction of trans) {
    const receipt = await transaction.getTransactionReceipt()
    const mesonLog = receipt.logs.find(x => x.address.toLowerCase() === mesonContract)
    const okxLog = receipt.logs.find(x => x.address.toLowerCase() === okxContract)
    if (mesonLog && okxLog) {
      console.log(total, ++count, receipt)
    }
  }
  blockNumber = blockNumber - 1000
  if (blockNumber > 0) {
    getLogs()
  }
}()
console.log('done')
