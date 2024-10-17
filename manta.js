import build from './build.js'
const okxContract = `0x91EcECC4F2363770c621a8a061A80d67cfEafEC7`.toLowerCase();
const mesonContract = `0x25aB3Efd52e6470681CE037cD546Dc60726948D3`.toLowerCase();
const rpc = { "network": "manta", "url": "https://manta-pacific.rpc.thirdweb.com", "type": "http" }
const getLogs = build('manta', rpc, okxContract, mesonContract, 2198680);
getLogs();