
import { readFile } from 'fs/promises';
const modes = ['a', 'b', 'c', 'd', 'e'];

export default async function check (args = {}) {

  const getCountsFileName = (mode) => {
    return `mode_${mode}_count_${args.chainName}_${args.tokenName}-${args.startBlock}-${args.endBlock}.json`;
  }
  const getTxHashByMethodsFileName = (mode) => {
    return `mode_${mode}_tx_hash_by_methods_${args.chainName}_${args.tokenName}-${args.startBlock}-${args.endBlock}.json`;
  }
  // 1. 对于Transfer(null,okx)，加不加receipt.to=okx是否都一样？ b
  async function checkTransferTxnsIsEqualToOkx () {
    const countsFileName = getCountsFileName('b');
    const fileContent = await readFile(countsFileName, { encoding: 'utf8' });
    const counts = JSON.parse(fileContent);
    if (counts.total === counts.toOkxCount) {
      console.log('验证通过：Transfer(null,okx)，加不加receipt.to=okx数量都一样。')
    } else {
      console.warn('验证失败：Transfer(null,okx)，加不加receipt.to=okx数量不一致。')
    }
  }


  // 2. Transfer(null,null)结果是否都包含Transfer(null,okx)？
  async function checkTransferNullContainsTransferToOkx () {
    const transferNullFileName = getTxHashByMethodsFileName('a');
    const transferToOkxFileName = getTxHashByMethodsFileName('b');
    const transferNullContent = await readFile(transferNullFileName, { encoding: 'utf8' });
    const transferToOkxContent = await readFile(transferToOkxFileName, { encoding: 'utf8' });
    const transferNullTxHashByMethods = JSON.parse(transferNullContent);
    const transferToOkxTxHashByMethods = JSON.parse(transferToOkxContent);
    const faildList = [];
    for (const method in transferToOkxTxHashByMethods) {
      const transferNullTxHashByMethod = transferNullTxHashByMethods[method];
      for (const item of transferToOkxTxHashByMethods[method]) {
        const tran = transferNullTxHashByMethod?.find(i => i.hash === item.hash);
        if (!tran) faildList.push(item);
      }
    }
    if (faildList.length > 0) {
      console.warn('验证失败：Transfer(null,null)结果是否都包含Transfer(null,okx)。');
      console.log("The faild list is: ");
      console.table(faildList);
    } else {
      console.log("验证通过：Transfer(null,null)结果是否都包含Transfer(null,okx)。");
    }
  }


  // 3. 查出来的方法是不是只有已知的那三种？
  async function checkMethods () {
    const knownMethods = ['bridgeToV2', 'swapBridgeToV2', 'claim'];
    const notKnowMethods = [];
    for (const mode of modes) {
      const fileName = getTxHashByMethodsFileName(mode);
      const fileContent = await readFile(fileName, { encoding: 'utf8' });
      const txHashByMethods = JSON.parse(fileContent);
      const methods = Object.keys(txHashByMethods);
      notKnowMethods.push(...methods.filter(m => !knownMethods.includes(m)));
    }
    if (notKnowMethods.length > 0) {
      console.warn('验证失败：查出来的方法是不是只有已知的那三种？');
      console.log("The not know methods is: ");
      console.table(notKnowMethods);
    } else {
      console.log("验证通过：查出来的方法只有已知的那三种。");
    }
    return notKnowMethods;
  }

  // 4. 对于Transfer(null,okx) 查出来的是不是都是使用的swapBridgeToV2方法？
  async function checkTransferOkxIsAllSwapBridgeToV2 () {
    const fileContent = await readFile(getTxHashByMethodsFileName('b'), { encoding: 'utf8' });
    const txHashByMethods = JSON.parse(fileContent);
    const methods = Object.keys(txHashByMethods);
    const isAllSwapBridgeToV2 = methods.every(m => m === 'swapBridgeToV2');
    if (isAllSwapBridgeToV2) {
      console.log('验证通过：Transfer(null,okx) 查出来的都是使用的swapBridgeToV2方法');
    } else {
      console.warn('验证失败：Transfer(null,okx) 查出来的不都是使用的swapBridgeToV2方法');
    }
  }

  // 5. getLogs的结果中包含usdc的日志的数据是否和 Transfer(null,null) 的结果一致？
  async function checkGetLogsIncludeUsdcIsEqualToTransferNull () {
    const transferNullFileContent = await readFile(getCountsFileName('a'), { encoding: 'utf8' });
    const transferNullCounts = JSON.parse(transferNullFileContent);
    const getLogsContent = await readFile(getCountsFileName('c'), { encoding: 'utf8' });
    const getLogsCounts = JSON.parse(getLogsContent);
    if (transferNullCounts.total === getLogsCounts.hasTokenLogCount) {
      console.log('验证通过：getLogs的结果中包含usdc的日志的数据是否和 Transfer(null,null) 的结果一致。')
    } else {
      console.warn('验证失败：getLogs的结果中包含usdc的日志的数据是否和 Transfer(null,null) 的结果不一致。')
    }
  }

  // 6. getLogs查询加上topics后，筛选出usdc日志筛选得出的结果是不是分别为 swapBridgeToV2 和 bridgeToV2 方法？
  async function checkGetLogsWithTopicsIsMethodInSwapBridgeToV2OrBridgeToV2 () {
    const getLogsWithTopicSwapBridgeToV2Content = await readFile(getTxHashByMethodsFileName('d'), { encoding: 'utf8' });
    const getLogsWithTopicSwapBridgeToV2TxHashByMethods = JSON.parse(getLogsWithTopicSwapBridgeToV2Content);
    const getLogsWithTopicBridgeToV2Content = await readFile(getTxHashByMethodsFileName('e'), { encoding: 'utf8' });
    const getLogsWithTopicBridgeToV2TxHashByMethods = JSON.parse(getLogsWithTopicBridgeToV2Content);
    const getLogsWithTopicSwapBridgeToV2Methods = Object.keys(getLogsWithTopicSwapBridgeToV2TxHashByMethods);
    const getLogsWithTopicBridgeToV2Methods = Object.keys(getLogsWithTopicBridgeToV2TxHashByMethods);
    const isAllSwapBridgeToV2 = getLogsWithTopicSwapBridgeToV2Methods.every(m => m === 'swapBridgeToV2');
    const isAllBridgeToV2 = getLogsWithTopicBridgeToV2Methods.every(m => m === 'bridgeToV2');
    if (isAllSwapBridgeToV2) {
      console.log('验证通过：getLogs查询加上topics=["0xb9d...714ea"]后，筛选出usdc日志筛选得出的结果全是swapBridgeToV2');
    } else {
      console.warn('验证失败：getLogs查询加上topics=["0xb9d...714ea"]后，筛选出usdc日志筛选得出的结果不全是swapBridgeToV2');
    }
    if (isAllBridgeToV2) {
      console.log('验证通过：getLogs查询加上topics=["0xf64...03b7a"]后，筛选出usdc日志筛选得出的结果全是bridgeToV2');
    } else {
      console.warn('验证失败：getLogs查询加上topics=["0xf64...03b7a"]后，筛选出usdc日志筛选得出的结果不全是bridgeToV2');
    }
  }

  await checkTransferTxnsIsEqualToOkx()
  await checkTransferNullContainsTransferToOkx()
  await checkMethods()
  await checkTransferOkxIsAllSwapBridgeToV2()
  await checkGetLogsIncludeUsdcIsEqualToTransferNull();
  await checkGetLogsWithTopicsIsMethodInSwapBridgeToV2OrBridgeToV2();
}