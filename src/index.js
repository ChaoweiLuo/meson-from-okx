import load from './load.js';
import { check } from './check.js'; 

const args = { chainName: 'xlayer', startBlock: 5602448, endBlock: 5612448, }
// const args = { chainName: 'xlayer', startBlock: 5500000, endBlock: 5612448, }
// const args = { chainName: 'arbitrum', startBlock: 267070739, endBlock: 267080739, }
// const args = { chainName: 'arbitrum', startBlock: 267000739, endBlock: 267080739, }
// const args = { chainName: 'opt', startBlock: 4601731, endBlock: 126595659, }


await load(args);
const ts = Date.now()
// await check(args);
console.log('ts', (Date.now() - ts) / 1000, 's')
