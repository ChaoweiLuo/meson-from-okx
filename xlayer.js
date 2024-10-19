
import { ethers } from "ethers";
const okxContract = '0xad7c9ca9d558f72dc15cbb33ec7002fba5f332a3';
const mesonContract = `0x25aB3Efd52e6470681CE037cD546Dc60726948D3`.toLowerCase()
const rpc = { "network": "xlayer", "url": "https://xlayerrpc.okx.com", "type": "http" }

const usdt = `0x1e4a5963abfd975d8c9021ce480b42188849d41d`.toLowerCase();

const provider = new ethers.providers.JsonRpcProvider(rpc.url);

const abi = [
  "function balanceOf(address) view returns (uint256)",
  "function Transfer(address from, address to, uint256 amount)",
  "event Transfer(address indexed from, address indexed to, uint256 amount)",
  "event Approval(address indexed owner, address indexed spender, uint value)",
];


const contract = new ethers.Contract(usdt, abi, provider);
let total = 0, count = 0

const filter = contract.filters.Transfer(okxContract);
let blockNumber = 5632449 // await provider.getBlockNumber();
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