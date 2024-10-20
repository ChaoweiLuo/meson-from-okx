import { ethers } from "ethers";
async function getResult ({ token, mesonContract, okxContract, rpc, blockCount } = {}) {
  console.time('start')
  const provider = new ethers.providers.JsonRpcProvider(rpc.url);
  const abi = [
    "function balanceOf(address) view returns (uint256)",
    "function Transfer(address from, address to, uint256 amount)",
    "event Transfer(address indexed from, address indexed to, uint256 amount)"
  ];

  const contract = new ethers.Contract(token, abi, provider);

  const filter = contract.filters.Transfer(null, okxContract);
  let total = 0, count = 0;
  let blockNumber = await provider.getBlockNumber();
  let minBlockNumber = blockNumber - blockCount;
  while (blockNumber > minBlockNumber) {
    const events = await contract.queryFilter(filter, Math.max(minBlockNumber, blockNumber - 1000), blockNumber);
    console.log('blockNumber:', blockNumber, 'events:', events.length, "total", total, "count", count)
    for (const event of events) {
      const receipt = await event.getTransactionReceipt();
      if (!receipt) { continue }
      if (String(receipt.to).toLowerCase() === okxContract) {
        total++;
        const mesonLog = receipt.logs.find(x => x.address.toLowerCase() === mesonContract);
        if (!!mesonLog) {
          count++;
          console.log('find', total, count, receipt)
        }
      } else {
        console.log('not okx', receipt.blockNumber, event.transactionHash)
      }
    }
    blockNumber = blockNumber - 1000
  }
  console.timeEnd('start')
  return { network: rpc.network, total, count, token }
}

const xlayer = {
  usdt: '0x1e4a5963abfd975d8c9021ce480b42188849d41d',
  usdc: '0x74b7f16337b8972027f6196a17a631ac6de26d22',
  getResult: async function (token = '0x1e4a5963abfd975d8c9021ce480b42188849d41d') {
    const config = {
      rpc: { network: 'xlayer', url: 'https://xlayerrpc.okx.com', type: 'http' },
      okxContract: '0x5965851f21dae82ea7c62f87fb7c57172e9f2add'.toLowerCase(),
      mesonContract: '0x25aB3Efd52e6470681CE037cD546Dc60726948D3'.toLowerCase(),
      blockCount: Number(process.env.DAYS || 1) * 3600 * 24 / 3,
      token,
    }
    const result = await getResult(config);
    console.log('xlayer result')
    console.dir(result)
  }
}

await xlayer.getResult(xlayer.usdt)