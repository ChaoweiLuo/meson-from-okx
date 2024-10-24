import load from './load.js';
import check from './check.js';

const args = {
  chainName: 'xlayer',
  startBlock: 5602448, // 5500000,
  endBlock: 5612448,
}

await load(args);
