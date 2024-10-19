import {build} from './build.js'
const okxContract = `0x91EcECC4F2363770c621a8a061A80d67cfEafEC7`.toLowerCase();
const mesonContract = `0x25aB3Efd52e6470681CE037cD546Dc60726948D3`.toLowerCase();
const rpc = { "network": "manta", "url": "https://manta-pacific.rpc.thirdweb.com", "type": "http" }

const mantaUSDT = `0xf417F5A458eC102B90352F697D6e2Ac3A3d2851f`
const mantaUSDC = `0xb73603C5d87fA094B7314C74ACE2e64D165016fb`

const blockCount = Number(process.env.DAYS || 1) * 3600 * 24 / 3;
const getLogs = build(rpc, okxContract, mesonContract, blockCount);
export const getMantaUSDT = () => getLogs(mantaUSDT)
export const getMantaUSDC = () => getLogs(mantaUSDC)

export default void async function () {
  const usdtP = getMantaUSDT()
  const usdcP = getMantaUSDC()
  const [usdc, usdt] = await Promise.all([usdtP, usdcP])
  return {
    usdc,
    usdt
  }
}()
