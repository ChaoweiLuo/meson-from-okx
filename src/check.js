import { readFile } from 'fs/promises'
import config from './config.json' assert { type: 'json'  };

export async function check({ chainName, startBlock, endBlock } = {}) {
  const chain = config[chainName];
  const receiptListFileName = `log_receipt_list_${chainName}_${startBlock}-${endBlock}.json`;
  const content = await readFile(receiptListFileName);
  const receiptList = JSON.parse(content);
  const mesonCount = receiptList.filter(x => x.logs.find(log => log.address.toLowerCase() === chain.mesonContract)).length;
  const txHashByMethodsFileName = `log_txHashByMethods_${chainName}_${startBlock}-${endBlock}.json`;
  const content2 = await readFile(txHashByMethodsFileName);
  const {txHashByMethods} = JSON.parse(content2);
  console.log(`一共 ${receiptList.length} 笔交易，包含Meson event的 ${mesonCount} 笔，其中：`);
  for (const m in txHashByMethods) {
    console.log(' ', `${m}:`, txHashByMethods[m].length);
  }
}