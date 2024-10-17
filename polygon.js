import build from "./build.js";
const rpc = { "network": "polygon", "url": "https://polygon-rpc.com", "type": "http" }

const okxContract = "0x9b8d9b9b5a0f7f7f7f7f7f7f7f7f7f7f7f7f7f7f"
const mesonContract = `0x25aB3Efd52e6470681CE037cD546Dc60726948D3`.toLowerCase()

const getLogs = build('polygon', rpc, okxContract, mesonContract);

getLogs();
