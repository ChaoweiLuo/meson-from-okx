import build from "../build.js";

const okxContract = '0x5965851f21dae82ea7c62f87fb7c57172e9f2add';
const mesonContract = `0x25aB3Efd52e6470681CE037cD546Dc60726948D3`.toLowerCase()
const rpc = { "network": "xlayer", "url": "https://xlayerrpc.okx.com", "type": "http" }

const getLogs = build('xlayer', rpc, okxContract, mesonContract);

void async function main() {
  await getLogs()
}()

// 已完成，整个链全下来了。
