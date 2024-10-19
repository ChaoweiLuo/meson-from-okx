import { build } from "./build.js";

const rpc = { "network": "opt", "url": "https://rpc.ankr.com/optimism", "type": "http" };
const okxContract = `0xf956D9FA19656D8e5219fd6fa8bA6cb198094138`.toLowerCase()
const mesonContract = `0x25aB3Efd52e6470681CE037cD546Dc60726948D3`.toLowerCase()

const blockCount = Number(process.env.DAYS || 1) * 3600 * 24 / 3;

const getLogs = build(rpc, okxContract, mesonContract, blockCount);

const usdt = '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58';
const usdc = '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85'

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
