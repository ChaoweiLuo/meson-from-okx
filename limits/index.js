import { getResult as getContract0Result } from './contract.0.js';
import { getResult as getContract1Result } from './contract.1.js';
import { getResult as getLogResult, topics } from './log.js';
import { avax, core, manta, opt, scroll, xlayer } from '../config.js';
import { createWriteStream } from 'fs';
import inquirer from 'inquirer';
function getChain (chainName) {
  switch (chainName) {
    case 'xlayer': return xlayer;
    case 'manta': return manta;
    case 'opt': return opt;
    case 'scroll': return scroll;
    case 'core': return core;
    case 'avax': return avax;
    default: throw new Error('Invaid chain.')
  }
}

const mode = {
  a: '使用token的queryFilter查询日志，参数为Transfer(null, null)',
  b: '使用token的queryFilter查询日志，参数为Transfer(null, okxContract)',
  c: '使用getLogs查询日志,参数为{address: okxContract}',
  d: '使用getLogs查询日志,参数为{address: okxContract, topics: ["0xf6481cbc1da19356c5cb6b884be507da735b89f21dc4bbb7c9b7cc0968b03b7a"]}',
  e: '使用getLogs查询日志,参数为{address: okxContract, topics: ["0xb9dae57db52a734b183c77227c96068231beb6a93a060ca7a9d3164f716714ea"]}',
}
const chains = ['xlayer', 'manta', 'opt', 'scroll', 'core', 'avax'];
const methodCode = {
  '0x972250fe': 'bridgeToV2',
  '0x3eee9156': 'claim',
  '0x3d21e25a': 'swapBridgeToV2'
}

async function main () {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'mode',
      message: 'Which method do you want to use for querying?',
      choices: Object.values(mode)
    },
    {
      type: 'list',
      name: 'chain',
      message: 'Which chain do you want to query?',
      choices: chains
    },
  ])
  const chain = getChain(answers.chain);
  const tokens = Object.keys(chain.tokens);
  const restAnswers = await inquirer.prompt([
    {
      type: 'list',
      name: 'token',
      message: 'Which token do you want to query?',
      choices: tokens
    },
    {
      type: 'input',
      name: 'startBlock',
      message: 'What is the startBlock number?',
    },
    {
      type: 'input',
      name: 'endBlock',
      message: 'What is the endBlock number?',
    },
  ])

  const args = {
    ...answers,
    ...restAnswers,
    ...chain,
    startBlock: +restAnswers.startBlock,
    endBlock: +restAnswers.endBlock,
    token: chain.tokens[restAnswers.token]
  }

  await call(args);

  async function call (args) {
    let result;
    switch (args.mode) {
      case mode.a: result = await getContract1Result(args); break;
      case mode.b: result = await getContract0Result(args); break;
      case mode.c: result = await getLogResult({ ...args }); break;
      case mode.d: result = await getLogResult({ ...args, topic: topics[0] }); break;
      case mode.e: result = await getLogResult({ ...args, topic: topics[1] }); break;
      default: break;
    }
    const { list, methodMap, ...logCounts } = result;
    console.log(logCounts)
    const m = Object.entries(mode).find(([q,w]) => w === answers.mode)[0]
    const listFileName = `log-${m}-${answers.chain}-${restAnswers.token}-logs-${Date.now()}.json`;
    const methodFileName = `log-${m}-${answers.chain}-${restAnswers.token}-methods-${Date.now()}.json`;
    createWriteStream(listFileName).write(JSON.stringify(list))
    const map = {};
    for (const c in methodMap) {
      if (Object.prototype.hasOwnProperty.call(methodMap, c)) {
        const values = methodMap[c];
        map[methodCode[c]] = values;
      }
    }
    createWriteStream(methodFileName).write(JSON.stringify(map));
    console.log('Receipt saved in ', listFileName);
    console.log('Method map data saved in ', methodFileName);
  }
}
void main()

function getDateString() {
  const date = new Date()
  const y = date.getUTCFullYear(),
    m = date.getUTCMonth(),
    d = date.getUTCDate();
  return `${y}-${m}-${d}`;
}