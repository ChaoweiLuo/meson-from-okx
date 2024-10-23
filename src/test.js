import load from './load.js';

await load({
  chainName: 'xlayer', 
  tokenName: 'usdc', 
  startBlock: 5602448,
  endBlock: 5612448,
  mode: 'c'
})
