import build from "./build.js";
const rpc = { "network": "polygon", "url": "https://polygon-rpc.com", "type": "http" }

const okxContract = "0xa748d6573aca135af68f2635be60cb80278bd855".toLowerCase()
const mesonContract = `0x25aB3Efd52e6470681CE037cD546Dc60726948D3`.toLowerCase()

const getLogs = build('polygon', rpc, okxContract, mesonContract, 61827543);

getLogs();
