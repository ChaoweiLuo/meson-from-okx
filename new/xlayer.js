import { build } from "./build.js";

const okxContract = '0x5965851f21dae82ea7c62f87fb7c57172e9f2add';
const mesonContract = `0x25aB3Efd52e6470681CE037cD546Dc60726948D3`.toLowerCase()
const rpc = { "network": "xlayer", "url": "https://xlayerrpc.okx.com", "type": "http" }
const usdt = '0x1e4a5963abfd975d8c9021ce480b42188849d41d';
const usdc = '0x74b7f16337b8972027f6196a17a631ac6de26d22'

const xlayerBlockCount = Number(process.env.DAYS || 1) * 3600 * 24 / 3;

const getLogs = build(rpc, okxContract, mesonContract, xlayerBlockCount);


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