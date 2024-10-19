import { build } from "./build.js";

const rpc = { "network": "scroll", "url": "https://rpc.ankr.com/scroll", "type": "http" }

const mesonContract = `0x25aB3Efd52e6470681CE037cD546Dc60726948D3`.toLowerCase()
const okxContract = `0xaf14797ccf963b1e3d028a9d51853ace16aedba1`.toLowerCase()

const scrollBlockCount = 3600 * 24 / 3;

const getLogs = build(rpc, okxContract, mesonContract, scrollBlockCount);

await getLogs()
