
import { readFile } from 'fs/promises';
const modes = ['a', 'b', 'c', 'd', 'e'];

export default async function check (args = {}) {

  const getCountsFileName = () => {
    return `mode_${args.mode}_count_${args.chainName}_${args.tokenName}-${args.startBlock}-${args.endBlock}.json`;
  }
  const getTxHashByMethodsFileName = () => {
    return `mode_${args.mode}_tx_hash_by_methods_${args.chainName}_${args.tokenName}-${args.startBlock}-${args.endBlock}.json`;
  }
  // 1. 对于Transfer(null,okx)，加不加receipt.to=okx是否都一样？ b
  async function checkTransferTxnsIsEqualToOkx () {
    const countsFileName = getCountsFileName('b');
    const fileContent = await readFile(countsFileName);
    const counts = JSON.parse(fileContent);
    if (counts.total === counts.toOkxCount) {
      console.log('验证通过：Transfer(null,okx)，加不加receipt.to=okx数量都一样。')
    } else {
      console.warn('验证失败：Transfer(null,okx)，加不加receipt.to=okx数量不一致。')
    }
  }

  await checkTransferTxnsIsEqualToOkx()

  // 2. Transfer(null,null)结果是否都包含Transfer(null,okx)？
  async function checkTransferNullContainsTransferToOkx () {
    const transferNullFileName = getTxHashByMethodsFileName('b');
    const transferToOkxFileName = getTxHashByMethodsFileName('a');
    const transferNullContent = await readFile(transferNullFileName);
    const transferToOkxContent = await readFile(transferToOkxFileName);
    const transferNullTxHashByMethods = JSON.parse(transferNullContent);
    const transferToOkxTxHashByMethods = JSON.parse(transferToOkxContent);
    const faildList = [];
    for (const method in transferToOkxTxHashByMethods) {
      const transferNullTxHashByMethod = transferNullTxHashByMethods[method];
      for (const item of transferToOkxTxHashByMethods[method]) {
        const tran = transferNullTxHashByMethod.find(i => i.hash === item.hash);
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

  await checkTransferNullContainsTransferToOkx()

  // 3. 查出来的方法是不是只有已知的那三种？
  async function checkMethods () {
    const knownMethods = ['bridgeToV2', 'swapBridgeToV2', 'claim'];
    const notKnowMethods = [];
    for (const mode of modes) {
      const fileName = getTxHashByMethodsFileName(mode);
      const fileContent = await readFile(fileName);
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
  }
  await checkMethods()
}