import { ethers } from "ethers"

const rpc = `https://xlayerrpc.okx.com`
const blockNumber = 5632448
const token = `0x1e4a5963abfd975d8c9021ce480b42188849d41d`
const provider = new ethers.providers.JsonRpcProvider(rpc)
const abi = [
  "function balanceOf(address) view returns (uint256)",
  "function Transfer(address from, address to, uint256 amount)",
  "event Transfer(address indexed from, address indexed to, uint256 amount)"
];
const okxContract = `0x5965851f21dae82ea7c62f87fb7c57172e9f2add`
const mesonContract = '0x25aB3Efd52e6470681CE037cD546Dc60726948D3'.toLowerCase()
const contract = new ethers.Contract(token, abi, provider);
const transfer = contract.filters.Transfer(null, null) 
const events = await contract.queryFilter(transfer, blockNumber, blockNumber)

for (const event of events) {
  const receipt = await provider.getTransactionReceipt(event.transactionHash);
  if (receipt.to.toLowerCase() !== okxContract) console.log('not okx', event.transactionHash)
  else if (!!receipt.logs.find(l => l.address.toLowerCase() === mesonContract )) console.log('is meson', event.transactionHash)
  else console.log('不满足要求', event.transactionHash)
}
