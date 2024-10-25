import load from './load.js';

// const args = { chainName: 'xlayer', startBlock: 5602448, endBlock: 5612448, }
// const args = { chainName: 'xlayer', startBlock: 5500000, endBlock: 5612448, }
// const args = { chainName: 'arbitrum', startBlock: 267070739, endBlock: 267080739, }
// const args = { chainName: 'arbitrum', startBlock: 267000739, endBlock: 267080739, }
// const args = { chainName: 'opt', startBlock: 4601731, endBlock: 126595659, }

const day = new Date(2024, 8, 8);
console.log(day.toUTCString());

const dayArgs = { chainName: 'xlayer', startTime: day.setUTCHours(0, 0, 0, 0), endTime: day.setUTCHours(23, 59, 59, 59) };

await load(dayArgs);
