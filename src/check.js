import { readFile } from 'fs/promises'
import config from './config.json' assert { type: 'json'  };

const topicMapToMethod = {
  "0x6d1b775ce655ea3b568c59e0f161908781f216e4d9feb04fa524ca23a44f4b07": "claim",
  "0xb9dae57db52a734b183c77227c96068231beb6a93a060ca7a9d3164f716714ea": "swapBridgeToV2",
  "0xf6481cbc1da19356c5cb6b884be507da735b89f21dc4bbb7c9b7cc0968b03b7a": "bridgeToV2",
  "0xffc60ee157a42f4d8edbd1897e6581a96d9ed04e44fb2ab53a47ce1eb8f2775b": "CommissionRecord"
}


export async function check({ chainName, startBlock, endBlock } = {}) {
  const chain = config[chainName];
  const receiptListFileName = `log_receipt_list_${chainName}_${startBlock}-${endBlock}.json`;
  const content = await readFile(receiptListFileName);
  const receiptList = JSON.parse(content);
  let mesonCount = 0;
  const mesonMethods = {}
  for (const receipt of receiptList) {
    if(receipt.logs.find(log => log.address.toLowerCase() === chain.mesonContract)) {
      mesonCount++;
      const methods = receipt.okxMethods.map(x => topicMapToMethod[x] || x).join(',');
      mesonMethods[methods] = mesonMethods[methods] || 0;
      mesonMethods[methods]++;
    }
  }
  console.log(`一共 ${receiptList.length} 笔交易，包含Meson event的 ${mesonCount} 笔，其中：`);
  for (const m in mesonMethods) {
    console.log(' ', `${m}:`, mesonMethods[m]);
  }
}