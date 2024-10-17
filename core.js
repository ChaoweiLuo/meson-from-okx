import build from "./build.js";

const okxContract = "0x07964f135f276412b3182a3B2407b8dd45000000".toLowerCase();
const mesonContract = `0x25aB3Efd52e6470681CE037cD546Dc60726948D3`.toLowerCase()
const rpc = { network: 'core', url: 'https://rpc.ankr.com/core', type: 'http' };

const getLogs = build('core', rpc, okxContract, mesonContract, 16253126);

getLogs();