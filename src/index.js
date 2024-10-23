import load from './load.js';
import check from './check.js';

const args = {
  chainName: 'xlayer',
  tokenName: 'usdc',
  startBlock: 5602448,
  endBlock: 5612448,
  mode: 'b'
}

const modes = ['a', 'b', 'c', 'd', 'e']
for (const mode of modes) {
  // await load({ ...args, mode})
}

await check(args)
