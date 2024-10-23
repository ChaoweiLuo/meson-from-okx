
import { getOkxTxns, topicMap } from './getOkxTxns.js';
import { getTransferTxns } from './getTransferTxns.js';
import config from './config.json' assert { type: 'json'  };
import { createWriteStream } from 'fs';

const methodCodeMap = {
  '0x972250fe': 'bridgeToV2',
  '0x3eee9156': 'claim',
  '0x3d21e25a': 'swapBridgeToV2'
}

export default async function load ({ mode, chainName, tokenName, startBlock, endBlock } = {}) {
  const ts = Date.now();
  const chain = config[chainName];
  const token = chain.tokens[tokenName];
  let result;
  switch (mode) {
    case "a": result = await getTransferTxns({ ...chain, token, startBlock, endBlock }); break;
    case "b": result = await getTransferTxns({ ...chain, token, startBlock, endBlock, toOkx: true }); break;
    case "c": result = await getOkxTxns({ ...chain, token, startBlock, endBlock }); break;
    case "d": result = await getOkxTxns({ ...chain, token, startBlock, endBlock, topic: topicMap.swapBridgeToV2 }); break;
    case "e": result = await getOkxTxns({ ...chain, token, startBlock, endBlock, topic: topicMap.bridgeToV2 }); break;
    default: break;
  }
  const { receiptList, txHashByMethods, counts } = result;
  const listFileName = `mode_${mode}_receipt_list_${chainName}_${tokenName}-${startBlock}-${endBlock}.json`;
  const methodFileName = `mode_${mode}_tx_hash_by_methods_${chainName}_${tokenName}-${startBlock}-${endBlock}.json`;
  createWriteStream(listFileName).write(JSON.stringify(receiptList, null, 2));
  const map = {};
  for (const c in txHashByMethods) {
    if (Object.prototype.hasOwnProperty.call(txHashByMethods, c)) {
      const values = txHashByMethods[c];
      const methodName = methodCodeMap[c];
      if (methodName) map[methodName] = values;
      else map[c] = values;
    }
  }
  createWriteStream(methodFileName).write(JSON.stringify(map, null, 2));
  console.log("Mode is: ", mode);
  console.log("The count is: ");
  console.table(counts);
  console.log('Time used: ', (Date.now() - ts) / 1000, 's');
  console.log('Block count: ', endBlock - startBlock + 1);
  console.log('Receipts saved in: ', listFileName);
  console.log('Method map saved in: ', methodFileName);
}