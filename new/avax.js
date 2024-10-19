import { build } from "./build.js";

const okxContract = "0xf956D9FA19656D8e5219fd6fa8bA6cb198094138".toLowerCase();
const mesonContract = `0x25aB3Efd52e6470681CE037cD546Dc60726948D3`.toLowerCase()
const rpc = { network: 'avax', url: 'https://api.zan.top/avax-mainnet/ext/bc/C/rpc', type: 'http' };
const usdt = `0xde3A24028580884448a5397872046a019649b084`
const usdc = `0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E`
const blockCount = Number(process.env.DAYS || 1) * 3600 * 24 / 2; // 2秒一个区块

const getLogs = build(rpc, okxContract, mesonContract, blockCount);



export const getUSDT = () => getLogs(usdt)
export const getUSDC = () => getLogs(usdc)

export default void async function () {
  const usdtP = getUSDT()
  const usdcP = getUSDC()
  const [usdc, usdt] = await Promise.all([usdcP, usdtP])
  return {
    usdc,
    usdt
  }
}()
