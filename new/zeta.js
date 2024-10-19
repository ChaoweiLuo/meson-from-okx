import { build } from "./build.js";

const rpc = { "network": "zeta", "url": "https://zetachain-evm.blockpi.network:443/v1/rpc/public", "type": "http" }
const okxContract = "0x81e3d4a5826a34f06065faf16a532ba2d471cb8e".toLowerCase();
const mesonContract = "0x25aB3Efd52e6470681CE037cD546Dc60726948D3".toLowerCase();

const blockCount = Number(process.env.DAYS || 1) * 3600 * 24 / 6; // 6秒一个区块

const getLogs = build(rpc, okxContract, mesonContract, blockCount);


const usdt = '';
const usdc = ''

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
