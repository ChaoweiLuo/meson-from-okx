import { build } from "./build.js";

const rpc = { "network": "scroll", "url": "https://rpc.ankr.com/scroll", "type": "http" }

const mesonContract = `0x25aB3Efd52e6470681CE037cD546Dc60726948D3`.toLowerCase()
const okxContract = `0xf956D9FA19656D8e5219fd6fa8bA6cb198094138`.toLowerCase()
const scrollUSDC = `0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4`.toLowerCase()
const scrollUSDT = `0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df`
const scrollBlockCount = Number(process.env.DAYS || 1) * 3600 * 24 / 3;

const getLogs = build(rpc, okxContract, mesonContract, scrollBlockCount);

export const getScrollUSDC = () => getLogs(scrollUSDC)
export const getScrollUSDT = () => getLogs(scrollUSDT)

export default void async function () {
  const usdtP = getScrollUSDT()
  const usdcP = getScrollUSDC()
  const [usdc, usdt] = await Promise.all([usdtP, usdcP])
  return {
    usdc,
    usdt
  }
}()
