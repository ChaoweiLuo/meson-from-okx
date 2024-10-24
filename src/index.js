import load from './load.js';

// const args = { chainName: 'xlayer', startBlock: 5602448, endBlock: 5612448, }
// const args = { chainName: 'xlayer', startBlock: 5500000, endBlock: 5612448, }
// const args = { chainName: 'arbitrum', startBlock: 267070739, endBlock: 267080739, }
const args = { chainName: 'arbitrum', startBlock: 267000739, endBlock: 267080739, }


await load(args);
