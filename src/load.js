
import { getOkxTxns, topicMap } from './getOkxTxns.js';
import config from './config.json' assert { type: 'json'  };
import { createWriteStream } from 'fs';
import { getBlockRange } from './util.js';


export default async function load ({ chainName, startBlock, endBlock, date } = {}) {
  const ts = Date.now();
  const chain = config[chainName];
  if(!startBlock || !endBlock && date) {
    const blockRange = await getBlockRange(chain.rpc, date);
    startBlock = blockRange.startBlock;
    endBlock = blockRange.endBlock;
  }
  let result = await getOkxTxns({ ...chain, startBlock, endBlock });

  const { receiptList, counts } = result;
  const txHashByMethods = getOkxMethods(receiptList);
  const receiptListFileName = `log_receipt_list_${chainName}_${startBlock}-${endBlock}.json`;
  createWriteStream(receiptListFileName).write(JSON.stringify(receiptList, null, 2));
  const countsFileName = `log_counts_${chainName}_${startBlock}-${endBlock}.json`;
  createWriteStream(countsFileName).write(JSON.stringify({ ...counts }, null, 2));
  const txHashByMethodsFileName = `log_txHashByMethods_${chainName}_${startBlock}-${endBlock}.json`;
  createWriteStream(txHashByMethodsFileName).write(JSON.stringify(txHashByMethods, null, 2));
/**
 * 一共293笔交易，包含Meson event的xxx笔，其中：
- bridgeToV2: xxx
- swapBridgeToV2: xxx
- bridgeToV2,CommissionRecord: xxx
 */
  console.log('chain:', chainName, ',startBlock:', startBlock, ',endBlock:', endBlock);
  console.log(`一共${counts.total}笔交易，包含Meson event的${counts.hasMesonEvent}笔，其中：`);
  for (const method in txHashByMethods.mesonTxHashByMethods) {
    console.log(' ', `${method}:`, txHashByMethods.mesonTxHashByMethods[method].length);
  }
  console.log('Time used: ', (Date.now() - ts) / 1000, 's');
  console.log('Block count: ', endBlock - startBlock + 1);
  console.log('The counts saved in: ', countsFileName)
  console.log('The receiptList saved in: ', receiptListFileName);
  console.log('The txHashByMethods saved in: ', txHashByMethodsFileName);
}

function getOkxMethods (receiptList) {
  const topicMapToMethod = {
    "0x6d1b775ce655ea3b568c59e0f161908781f216e4d9feb04fa524ca23a44f4b07": "claim",
    "0xb9dae57db52a734b183c77227c96068231beb6a93a060ca7a9d3164f716714ea": "swapBridgeToV2",
    "0xf6481cbc1da19356c5cb6b884be507da735b89f21dc4bbb7c9b7cc0968b03b7a": "bridgeToV2",
    "0xffc60ee157a42f4d8edbd1897e6581a96d9ed04e44fb2ab53a47ce1eb8f2775b": "CommissionRecord"
  }
  const txHashByMethods = {};
  const mesonTxHashByMethods = {};
  for (const receipt of receiptList) {
    if (receipt.okxMethods?.length) {
      const methods = receipt.okxMethods.map(x => topicMapToMethod[x] || x).join(',');
      txHashByMethods[methods] = txHashByMethods[methods] || [];
      txHashByMethods[methods].push(receipt.transactionHash);
      if (receipt.meson) {
        mesonTxHashByMethods[methods] = mesonTxHashByMethods[methods] || [];
        mesonTxHashByMethods[methods].push(receipt.transactionHash);
      }
    }
  }

  return { txHashByMethods, mesonTxHashByMethods }
}