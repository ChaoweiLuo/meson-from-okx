import { build } from "./build.js";

const rpc = { "network": "zeta", "url": "https://zetachain-evm.blockpi.network:443/v1/rpc/public", "type": "http" }
const okxContract = "0x81e3d4a5826a34f06065faf16a532ba2d471cb8e".toLowerCase();
const mesonContract = "0x25aB3Efd52e6470681CE037cD546Dc60726948D3".toLowerCase();

const blockCount = 3600 * 24 / 6; // 6秒一个区块

const getLogs = build(rpc, okxContract, mesonContract, blockCount);

export default getLogs()
