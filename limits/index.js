import { getResult as getContract0Result } from './contract.0.js';
import { getResult as getContract1Result } from './contract.1.js';
import { getResult as getLogResult, topics } from './log.js';
import { avax, core, manta, opt, scroll, xlayer } from '../config.js';
import { createWriteStream } from 'fs';

const modes = {
  a: '使用token的queryFilter查询日志，参数为Transfer(null, null)',
  b: '使用token的queryFilter查询日志，参数为Transfer(null, okxContract)',
  c: '使用getLogs查询日志,参数为{address: okxContract}',
  d: '使用getLogs查询日志,参数为{address: okxContract, topics: ["0xf6481cbc1da19356c5cb6b884be507da735b89f21dc4bbb7c9b7cc0968b03b7a"]}',
  e: '使用getLogs查询日志,参数为{address: okxContract, topics: ["0xb9dae57db52a734b183c77227c96068231beb6a93a060ca7a9d3164f716714ea"]}',
}
const methodCode = {
  '0x972250fe': 'bridgeToV2',
  '0x3eee9156': 'claim',
  '0x3d21e25a': 'swapBridgeToV2'
}

async function main () {
  const args = {
    chain: xlayer,
    startBlock: 5602448,
    endBlock: 5612448,
    token: xlayer.tokens.usdc,
    mode: modes.a
  }

  await call(args);
  

  async function call ({mode, chain, token, startBlock, endBlock} = {}) {
    let result;
    switch (mode) {
      case modes.a: result = await getContract1Result({ ...chain, token, startBlock, endBlock }); break;
      case modes.b: result = await getContract0Result({ ...chain, token, startBlock, endBlock }); break;
      case modes.c: result = await getLogResult({ ...chain, token, startBlock, endBlock }); break;
      case modes.d: result = await getLogResult({ ...chain, token, startBlock, endBlock, topic: topics[0] }); break;
      case modes.e: result = await getLogResult({ ...chain, token, startBlock, endBlock, topic: topics[1] }); break;
      default: break;
    }
    const { list, methodMap, ...logCounts } = result;
    console.log("mode is ", mode, "count is", logCounts);
    const m = Object.entries(modes).find(([q,w]) => w === mode)[0]
    const listFileName = `log-${m}-${chain.rpc.network}-${token}-logs-${Date.now()}.json`;
    const methodFileName = `log-${m}-${chain.rpc.network}-${token}-methods-${Date.now()}.json`;
    createWriteStream(listFileName).write(JSON.stringify(list, null, 2));
    const map = {};
    for (const c in methodMap) {
      if (Object.prototype.hasOwnProperty.call(methodMap, c)) {
        const values = methodMap[c];
        map[methodCode[c]] = values;
      }
    }
    createWriteStream(methodFileName).write(JSON.stringify(map, null, 2));
    console.log('Receipt saved in ', listFileName);
    console.log('Method map data saved in ', methodFileName);
  }
}
void main()


