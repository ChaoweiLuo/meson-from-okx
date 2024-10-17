import build from "./build.js";

const okxContract = "0xf956D9FA19656D8e5219fd6fa8bA6cb198094138".toLowerCase();
const mesonContract = `0x25aB3Efd52e6470681CE037cD546Dc60726948D3`.toLowerCase()
const rpc = { network: 'avax', url: 'https://avalanche.public-rpc.com', type: 'http' };

const getLogs = build('avax', rpc, okxContract, mesonContract, 48823016);

getLogs();