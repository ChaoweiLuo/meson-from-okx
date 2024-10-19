import { build } from "./build.js";

const okxContract = "0x07964f135f276412b3182a3B2407b8dd45000000".toLowerCase();
const mesonContract = `0x25aB3Efd52e6470681CE037cD546Dc60726948D3`.toLowerCase()
const rpc = { network: 'core', url: 'https://rpc.ankr.com/core', type: 'http' };

const blockCount = Number(process.env.DAYS || 1) * 3600 * 24 / 2; // 2秒一个区块

const getLogs = build(rpc, okxContract, mesonContract, blockCount);

const usdt = `0x900101d06a7426441ae63e9ab3b9b0f63be145f1`
const usdc = `0xa4151b2b3e269645181dccf2d426ce75fcbdeca9`

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