import { build } from "./build.js";

const rpc = { "network": "opt", "url": "https://rpc.ankr.com/optimism", "type": "http" };
const okxContract = `0xf956D9FA19656D8e5219fd6fa8bA6cb198094138`.toLowerCase()
const mesonContract = `0x25aB3Efd52e6470681CE037cD546Dc60726948D3`.toLowerCase()

const blockCount = 3600 * 24 / 3;

const getLogs = build(rpc, okxContract, mesonContract, blockCount);

export default getLogs()