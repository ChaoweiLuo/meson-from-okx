
import { getOkxTxns, topicMap } from './getOkxTxns.js';
import config from './config.json' assert { type: 'json'  };
import { createWriteStream } from 'fs';


export default async function load ({ chainName, startBlock, endBlock } = {}) {
  const ts = Date.now();
  const chain = config[chainName];
  let result = await getOkxTxns({ ...chain, startBlock, endBlock });

  const { receiptList, counts } = result;
  const tokenCounts = getTokenCounts(receiptList);
  const txHashByMethods = getOkxMethods(receiptList);
  const receiptListFileName = `log_receipt_list_${chainName}_${startBlock}-${endBlock}.json`;
  createWriteStream(receiptListFileName).write(JSON.stringify(receiptList, null, 2));
  const countsFileName = `log_counts_${chainName}_${startBlock}-${endBlock}.json`;
  createWriteStream(countsFileName).write(JSON.stringify({ ...counts }, null, 2));
  const txHashByMethodsFileName = `log_txHashByMethods_${chainName}_${startBlock}-${endBlock}.json`;
  createWriteStream(txHashByMethodsFileName).write(JSON.stringify(txHashByMethods, null, 2));

  console.log('chain:', chainName, ',startBlock:', startBlock, ',endBlock:', endBlock);
  console.log("查询到的交易数量: ", counts.total);

  console.log('交易中包含USDC&USDT的数量：');
  for (const k in tokenCounts) {
    console.log(' ', `${k}:`, tokenCounts[k]);
  }
  console.log('方法对应的交易数量:');
  for (const method in txHashByMethods.txHashByMethods) {
    console.log(' ', `${method}:`, txHashByMethods.txHashByMethods[method].length);
  }
  console.log('Time used: ', (Date.now() - ts) / 1000, 's');
  console.log('Block count: ', endBlock - startBlock + 1);
  console.log('The counts saved in: ', countsFileName)
  console.log('The receiptList saved in: ', receiptListFileName);
  console.log('The txHashByMethods saved in: ', txHashByMethodsFileName);
}

function getTokenCounts (receiptList) {
  const tokenCounts = { usdc: 0, usdt: 0, bothCount: 0, noneCount: 0 };
  for (const receipt of receiptList) {
    if (receipt.usdc && receipt.usdt) tokenCounts.bothCount++;
    if (receipt.usdc) tokenCounts.usdc++;
    if (receipt.usdt) tokenCounts.usdt++;
    if (!receipt.usdc && !receipt.usdt) tokenCounts.noneCount++;
  }
  return tokenCounts
}

function getOkxMethods (receiptList) {
  const topicMapToMethod = {
    "0x6d1b775ce655ea3b568c59e0f161908781f216e4d9feb04fa524ca23a44f4b07": "claim",
    "0xb9dae57db52a734b183c77227c96068231beb6a93a060ca7a9d3164f716714ea": "swapBridgeToV2",
    "0xf6481cbc1da19356c5cb6b884be507da735b89f21dc4bbb7c9b7cc0968b03b7a": "bridgeToV2"
  }
  const txHashByMethods = {};
  const usdtTxHashByMethods = {};
  const usdcTxHashByMethods = {};
  const bothTxHashByMethods = {};
  for (const receipt of receiptList) {
    if (receipt.okxMethods?.length) {
      const methods = receipt.okxMethods.map(x => topicMapToMethod[x] || x).join(',');
      txHashByMethods[methods] = txHashByMethods[methods] || [];
      txHashByMethods[methods].push(receipt.transactionHash);
      if (receipt.usdc && receipt.usdt) {
        bothTxHashByMethods[methods] = bothTxHashByMethods[methods] || [];
        bothTxHashByMethods[methods].push(receipt.transactionHash);
      } else if (receipt.usdc) {
        usdcTxHashByMethods[methods] = usdcTxHashByMethods[methods] || [];
        usdcTxHashByMethods[methods].push(receipt.transactionHash);
      } else if (receipt.usdt) {
        usdtTxHashByMethods[methods] = usdtTxHashByMethods[methods] || [];
        usdtTxHashByMethods[methods].push(receipt.transactionHash);
      }
    }
  }

  return { txHashByMethods, usdtTxHashByMethods, usdcTxHashByMethods, bothTxHashByMethods }
}