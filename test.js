import { ethers } from 'ethers';
const hash = `0x75f1a84134dad1a9dde6636cb6340bfc8d4aa4aff929d48754b042c4dfd9a1be`
const rpc = { "network": "scroll", "url": "https://rpc.ankr.com/scroll", "type": "http" }
const mesonContract = `0x25aB3Efd52e6470681CE037cD546Dc60726948D3`.toLowerCase()
const okxContract = `0xf956d9fa19656d8e5219fd6fa8ba6cb198094138`.toLowerCase()
const usdt = `0xf55bec9cafdbe8730f096aa55dad6d22d44099df`.toLowerCase()
const provider = new ethers.providers.JsonRpcProvider(rpc.url);

const receipt = await provider.getTransactionReceipt(hash)
console.log(receipt)