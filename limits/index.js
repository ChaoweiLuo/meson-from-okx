import { getResult as getContract0Result } from './contract.0.js';
import { getResult as getContract1Result } from './contract.1.js';
import { getResult as getLogResult } from './log.js';
import { xlayer } from '../config.js';


// const contract0Promise = getContract0Result({ ...xlayer, token: xlayer.tokens.usdc, blockCount: xlayer.blockCount * 3 })
// const contract1Promise = getContract1Result({ ...xlayer, token: xlayer.tokens.usdc, blockCount: xlayer.blockCount * 3 })
const logPromise = getLogResult({ ...xlayer, token: xlayer.tokens.usdc, startBlock: 5632448- 30000, endBlock: 5632448 })
const result = await logPromise
console.log(result)
// await Promise.all([contract0Promise, contract1Promise, logPromise]);
console.log('done')
