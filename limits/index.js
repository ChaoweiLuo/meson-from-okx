import { getResult as getContract0Result } from './contract.0.js';
import { getResult as getContract1Result } from './contract.1.js';
import { getResult as getLogResult } from './log.js';
import { xlayer } from '../config.js';
import { createWriteStream } from 'fs';

const arg = { ...xlayer, token: xlayer.tokens.usdc, startBlock: 5632448 - 30000, endBlock: 5632448 }

