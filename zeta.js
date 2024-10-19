
import { ethers } from "ethers";
const rpc = { "network": "zeta", "url": "https://zetachain-evm.blockpi.network:443/v1/rpc/public", "type": "http" }

const mesonContract = `0x25aB3Efd52e6470681CE037cD546Dc60726948D3`.toLowerCase()
const okxContract = `0xf956d9fa19656d8e5219fd6fa8ba6cb198094138`.toLowerCase()
const usdt = `0xf417F5A458eC102B90352F697D6e2Ac3A3d2851f`.toLowerCase();
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
await void async function getLogs () {
  const trans = await contract.queryFilter(filter, blockNumber - 1000, blockNumber)
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