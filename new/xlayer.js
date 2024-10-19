import { build } from "./build.js";

const okxContract = '0x5965851f21dae82ea7c62f87fb7c57172e9f2add';
const mesonContract = `0x25aB3Efd52e6470681CE037cD546Dc60726948D3`.toLowerCase()
const rpc = { "network": "xlayer", "url": "https://xlayerrpc.okx.com", "type": "http" }

const xlayerBlockCount = Number(process.env.DAYS || 1) * 3600 * 24 / 3;

const getLogs = build(rpc, okxContract, mesonContract, xlayerBlockCount);

export default getLogs()