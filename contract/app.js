import { ethers } from "ethers";
const rpc = { "network": "xlayer", "url": "https://xlayerrpc.okx.com", "type": "http" }

const mesonContract = `0x25aB3Efd52e6470681CE037cD546Dc60726948D3`.toLowerCase()
const okxContract = `0xf956d9fa19656d8e5219fd6fa8ba6cb198094138`.toLowerCase()
const usdcContract = `0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4`.toLowerCase()
const usdt = `0x1e4a5963abfd975d8c9021ce480b42188849d41d`.toLowerCase()


const provider = new ethers.providers.JsonRpcProvider(rpc.url);

const abi = [
  "function balanceOf(address) view returns (uint256)",
  "function Transfer(address from, address to, uint256 amount)",
  "event Transfer(address indexed from, address indexed to, uint256 amount)"
];

const contract = new ethers.Contract(usdt, abi, provider);

const filter = contract.filters.Transfer(null, mesonContract);
let blockNumber = await provider.getBlockNumber();
void async function getLogs () {
  const trans = await contract.queryFilter(filter, blockNumber - 10000, blockNumber)
  console.log(trans.length, blockNumber)
  for (const transaction of trans) {
    const receipt = await transaction.getTransactionReceipt()
    const mesonLog = receipt.logs.find(x => x.address.toLowerCase() === mesonContract)
    const okxLog = receipt.logs.find(x => x.address.toLowerCase() === okxContract)
    if (mesonLog && okxLog) {
      console.log(receipt)
    }
  }
  blockNumber = blockNumber - 1000
  if (blockNumber > 0) {
    getLogs()
  }
}()
console.log('done')
