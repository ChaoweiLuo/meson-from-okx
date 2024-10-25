import { ethers } from "ethers";

export async function getBlockRange (rpc, date) {
  const provider = new ethers.providers.JsonRpcProvider(rpc.url);
  async function getBlockTime (blockNumber) {
    const blockTimeMap = {};
    if (!blockTimeMap[blockNumber]) {
      const time = await provider.getBlock(blockNumber).then(x => x.timestamp * 1000);
      blockTimeMap[blockNumber] = time;
    }
    return blockTimeMap[blockNumber];
  }
  const maxBlockNumber = await provider.getBlockNumber();
  const maxBlockTime = await getBlockTime(maxBlockNumber);
  const otherBlockTime = await getBlockTime(maxBlockNumber - 100);

  const blockIntervalTime = (maxBlockTime - otherBlockTime) / 100; // 大概的间隔时间 

  const startTime = new Date(date).setUTCHours(0, 0, 0, 0).valueOf() - 1;

  const endTime = startTime + 1000 * 60 * 60 * 24;
  if (startTime > maxBlockTime) {
    console.error('Start time:', startTime, 'is greater than maxBlockTime:', maxBlockTime);
  }
  // 计算时间差，并计算出差不多的区块号。再逐一的去校验区块是否满足时间的要求
  let startBlock = Math.round(maxBlockNumber - (maxBlockTime - startTime) / blockIntervalTime);
  let endBlock = Math.round(maxBlockNumber - (maxBlockTime - endTime) / blockIntervalTime);
  async function checkBlockTime (blockNumber, time) {

    const blockTime = await getBlockTime(blockNumber);
    if (Math.abs(blockTime - time) < blockIntervalTime) {
      return blockNumber;
    }
    blockNumber = Math.round(blockNumber - (blockTime - time) / blockIntervalTime);
    return checkBlockTime(blockNumber, time);
  }
  startBlock = await checkBlockTime(startBlock, startTime);
  endBlock = await checkBlockTime(endBlock, endTime);
  if (startBlock > endBlock) {
    console.warn('startBlock:', startBlock, 'is greater than endBlock:', endBlock);
  }
  return { startBlock, endBlock, }
}

const rpc = {
  "network": "xlayer",
  "url": "https://xlayerrpc.okx.com",
  "type": "http"
}

// const date = new Date(2024, 8, 8)
// console.log('UTC Time:', new Date().toISOString());

// const blockRange = await getBlockRange(rpc, date);
// console.log(blockRange)