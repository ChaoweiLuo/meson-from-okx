import { getResult as getLogResult } from "./log.js";

const core = {
  usdt: '0x900101d06a7426441ae63e9ab3b9b0f63be145f1',
  usdc: '0xa4151b2b3e269645181dccf2d426ce75fcbdeca9',
  getResult: async function (tokenContract = '0x900101d06a7426441ae63e9ab3b9b0f63be145f1') {
    const coreConfig = {
      rpc: { network: 'core', url: 'https://rpc.ankr.com/core', type: 'http' },
      okxContract: '0x07964f135f276412b3182a3B2407b8dd45000000'.toLowerCase(),
      mesonContract: '0x25aB3Efd52e6470681CE037cD546Dc60726948D3'.toLowerCase(),
      blockCount: Number(process.env.DAYS || 1) * 3600 * 24 / 2,
      tokenContract
    }
    const getResult = getLogResult(coreConfig);
    const result = await getResult();
    console.log('core result: ')
    console.dir(result)
  }
}

const scroll = {
  usdt: '0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df',
  usdc: '0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4',
  getResult: async function (tokenContract = '0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df') {
    const config = {
      rpc: { network: 'scroll', url: 'https://rpc.ankr.com/scroll', type: 'http' },
      okxContract: '0x3335733c454805df6a77f825f266e136FB4a3333'.toLowerCase(),
      mesonContract: '0x25aB3Efd52e6470681CE037cD546Dc60726948D3'.toLowerCase(),
      blockCount: Number(process.env.DAYS || 1) * 3600 * 24 / 3,
      tokenContract,
    }
    const getResult = getLogResult(config);
    const result = await getResult();
    console.log('scroll result')
    console.dir(result)
  }
}

const xlayer = {
  usdt: '0x1e4a5963abfd975d8c9021ce480b42188849d41d',
  usdc: '0x74b7f16337b8972027f6196a17a631ac6de26d22',
  getResult: async function (tokenContract = '0x1e4a5963abfd975d8c9021ce480b42188849d41d') {
    const config = {
      rpc: { network: 'xlayer', url: 'https://xlayerrpc.okx.com', type: 'http' },
      okxContract: '0x5965851f21dae82ea7c62f87fb7c57172e9f2add'.toLowerCase(),
      mesonContract: '0x25aB3Efd52e6470681CE037cD546Dc60726948D3'.toLowerCase(),
      blockCount: Number(process.env.DAYS || 1) * 3600 * 24 / 3,
      tokenContract,
    }
    const getResult = getLogResult(config);
    const result = await getResult();
    console.log('xlayer result')
    console.dir(result)
  }
}

const manta = {
  usdt: '0xf417F5A458eC102B90352F697D6e2Ac3A3d2851f',
  usdc: '0xb73603C5d87fA094B7314C74ACE2e64D165016fb',
  getResult: async function (tokenContract = '0xf417F5A458eC102B90352F697D6e2Ac3A3d2851f') {
    const config = {
      rpc: { network: 'manta', url: 'https://manta-pacific.rpc.thirdweb.com', type: 'http' },
      okxContract: '0x91EcECC4F2363770c621a8a061A80d67cfEafEC7'.toLowerCase(),
      mesonContract: '0x25aB3Efd52e6470681CE037cD546Dc60726948D3'.toLowerCase(),
      blockCount: Number(process.env.DAYS || 1) * 3600 * 24 / 3,
      tokenContract,
    }
    const getResult = getLogResult(config);
    const result = await getResult();
    console.log('manta result')
    console.dir(result)
  }
}

const opt = {
  usdt: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
  usdc: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
  getResult: async function (tokenContract = '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58') {
    const config = {
      rpc: { network: 'opt', url: 'https://rpc.ankr.com/optimism', type: 'http' },
      okxContract: '0xf956D9FA19656D8e5219fd6fa8bA6cb198094138'.toLowerCase(),
      mesonContract: '0x25aB3Efd52e6470681CE037cD546Dc60726948D3'.toLowerCase(),
      blockCount: Number(process.env.DAYS || 1) * 3600 * 24 / 3,
      tokenContract,
    }
    const getResult = getLogResult(config);
    const result = await getResult();
    console.log('opt result')
    console.dir(result)
  }
}

const avax = {
  usdt: '0xde3A24028580884448a5397872046a019649b084',
  usdc: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
  getResult: async function (tokenContract = '0xde3A24028580884448a5397872046a019649b084') {
    const config = {
      rpc: { network: 'avax', url: 'https://api.zan.top/avax-mainnet/ext/bc/C/rpc', type: 'http' },
      okxContract: '0xf956D9FA19656D8e5219fd6fa8bA6cb198094138'.toLowerCase(),
      mesonContract: '0x25aB3Efd52e6470681CE037cD546Dc60726948D3'.toLowerCase(),
      blockCount: Number(process.env.DAYS || 1) * 3600 * 24 / 2,
      tokenContract,
    }
    const getResult = getLogResult(config);
    const result = await getResult();
    console.log('avax result')
    console.dir(result)
  }
}

// 获取xlayer链上okx经meson的交易
await xlayer.getResult(xlayer.usdt);
