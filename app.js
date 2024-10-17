import { ethers } from "ethers";
import { Web3 } from "web3";

const rpcs = [
  { "network": "eth", "url": "https://rpc.ankr.com/eth", "type": "http" },
  { "network": "eth", "url": "https://eth-mainnet.public.blastapi.io", "type": "http" },
  { "network": "bnb", "url": "https://rpc.ankr.com/bsc/0736cf6d3d3d0f6051b4f1d8cfe097912d81728009b39f4f0b1ad0ec7d1e480c", "type": "http" },
  { "network": "polygon", "url": "https://rpc.ankr.com/polygon", "type": "http" },
  { "network": "polygon", "url": "https://polygon-rpc.com", "type": "http" },
  { "network": "avax", "url": "https://api.avax.network/ext/bc/C/rpc", "type": "http" },
  { "network": "avax", "url": "https://rpc.ankr.com/avalanche", "type": "http" },
  { "network": "avax", "url": "https://ava-mainnet.public.blastapi.io/ext/bc/C/rpc", "type": "http" },
  { "network": "ftm", "url": "https://rpc.ftm.tools", "type": "http" },
  { "network": "aurora", "url": "https://mainnet.aurora.dev", "type": "http" },
  { "network": "opt", "url": "https://mainnet.optimism.io", "type": "http" },
  { "network": "opt", "url": "https://optimism-mainnet.public.blastapi.io", "type": "http" },
  { "network": "one", "url": "https://api.s0.t.hmny.io", "type": "http" },
  { "network": "one", "url": "https://a.api.s0.t.hmny.io", "type": "http" },
  { "network": "one", "url": "https://api.harmony.one", "type": "http" },
  { "network": "cfx", "url": "https://evm.confluxrpc.com", "type": "http" },
  { "network": "evmos", "url": "https://eth.bd.evmos.org:8545", "type": "http" },
  { "network": "evmos", "url": "https://evmos-mainnet.gateway.pokt.network/v1/lb/627586ddea1b320039c95205", "type": "http" },
  { "network": "movr", "url": "https://moonriver.public.blastapi.io", "type": "http" },
  { "network": "beam", "url": "https://moonbeam.public.blastapi.io", "type": "http" },
  { "network": "beam", "url": "https://rpc.ankr.com/moonbeam", "type": "http" },
  { "network": "tron", "url": "https://chaotic-lively-owl.tron-mainnet.quiknode.pro/9ae58325b486dd62ef57cffa96d436c3d54883ec", "type": "http" },
  { "network": "zksync", "url": "https://mainnet.era.zksync.io", "type": "http" },
  { "network": "zksync", "url": "https://zksync-era.blockpi.network/v1/rpc/public", "type": "http" },
  { "network": "zkevm", "url": "https://zkevm-rpc.com", "type": "http" },
  { "network": "aurora", "url": "https://endpoints.omniatech.io/v1/aurora/mainnet/public", "type": "http" },
  { "network": "movr", "url": "https://rpc.api.moonriver.moonbeam.network", "type": "http" },
  { "network": "movr", "url": "https://moonriver.api.onfinality.io/public", "type": "http" },
  { "network": "zkevm", "url": "https://1rpc.io/polygon/zkevm", "type": "http" },
  { "network": "beam", "url": "https://rpc.api.moonbeam.network", "type": "http" },
  { "network": "opt", "url": "https://rpc.ankr.com/optimism", "type": "http" },
  { "network": "opt", "url": "https://optimism.api.onfinality.io/public", "type": "http" },
  { "network": "sui", "url": "https://rpc.ankr.com/sui/0736cf6d3d3d0f6051b4f1d8cfe097912d81728009b39f4f0b1ad0ec7d1e480c", "type": "http" },
  { "network": "aptos", "url": "https://fullnode.mainnet.aptoslabs.com", "type": "http" },
  { "network": "aptos", "url": "https://rpc.ankr.com/premium-http/aptos/0736cf6d3d3d0f6051b4f1d8cfe097912d81728009b39f4f0b1ad0ec7d1e480c", "type": "http" },
  { "network": "cronos", "url": "https://cronos.blockpi.network/v1/rpc/public", "type": "http" },
  { "network": "zkevm", "url": "https://rpc.polygon-zkevm.gateway.fm", "type": "http" },
  { "network": "celo", "url": "https://1rpc.io/celo", "type": "http" },
  { "network": "celo", "url": "https://forno.celo.org", "type": "http" },
  { "network": "celo", "url": "https://rpc.ankr.com/celo", "type": "http" },
  { "network": "solana", "url": "https://rpc.ankr.com/solana/0736cf6d3d3d0f6051b4f1d8cfe097912d81728009b39f4f0b1ad0ec7d1e480c", "type": "http" },
  { "network": "zkfair_", "url": "https://rpc.zkfair.io", "type": "http" },
  { "network": "ftm", "url": "https://rpc.ankr.com/fantom", "type": "http" },
  { "network": "ftm", "url": "https://fantom.api.onfinality.io/public", "type": "http" },
  { "network": "arb", "url": "https://arbitrum.api.onfinality.io/public", "type": "http" },
  { "network": "kava", "url": "https://evm.kava.chainstacklabs.com", "type": "http" },
  { "network": "kava", "url": "https://kava-evm.publicnode.com", "type": "http" },
  { "network": "kava", "url": "https://kava-pokt.nodies.app", "type": "http" },
  { "network": "eth", "url": "https://ethereum.blockpi.network/v1/rpc/public", "type": "http" },
  { "network": "eth", "url": "https://eth.llamarpc.com", "type": "http" },
  { "network": "eth", "url": "https://eth.api.onfinality.io/public", "type": "http" },
  { "network": "eth", "url": "https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7", "type": "http" },
  { "network": "eth", "url": "https://eth.rpc.blxrbdn.com", "type": "http" },
  { "network": "base", "url": "https://base.gateway.tenderly.co", "type": "http" },
  { "network": "base", "url": "https://base-mainnet.public.blastapi.io", "type": "http" },
  { "network": "base", "url": "https://mainnet.base.org", "type": "http" },
  { "network": "scroll", "url": "https://rpc.ankr.com/scroll", "type": "http" },
  { "network": "scroll", "url": "https://scroll-mainnet.public.blastapi.io", "type": "http" },
  { "network": "scroll", "url": "https://rpc.scroll.io", "type": "http" },
  { "network": "polygon", "url": "https://polygon-mainnet.public.blastapi.io", "type": "http" },
  { "network": "polygon", "url": "https://polygon-pokt.nodies.app", "type": "http" },
  { "network": "polygon", "url": "https://polygon.blockpi.network/v1/rpc/public", "type": "http" },
  { "network": "scroll", "url": "https://scroll.blockpi.network/v1/rpc/public", "type": "http" },
  { "network": "manta", "url": "https://1rpc.io/manta", "type": "http" },
  { "network": "manta", "url": "https://pacific-rpc.manta.network/http", "type": "http" },
  { "network": "manta", "url": "https://manta-pacific.rpc.thirdweb.com", "type": "http" },
  { "network": "arb", "url": "https://arbitrum-one.publicnode.com", "type": "http" },
  { "network": "arb", "url": "https://1rpc.io/arb", "type": "http" },
  { "network": "bevm", "url": "https://rpc-canary-1.bevm.io", "type": "http" },
  { "network": "bevm", "url": "https://rpc-canary-2.bevm.io", "type": "http" },
  { "network": "arb", "url": "https://rpc.ankr.com/arbitrum/0736cf6d3d3d0f6051b4f1d8cfe097912d81728009b39f4f0b1ad0ec7d1e480c", "type": "http" },
  { "network": "zeta", "url": "https://zetachain-evm.blockpi.network:443/v1/rpc/public", "type": "http" },
  { "network": "zeta", "url": "https://zetachain-mainnet-archive.allthatnode.com:8545", "type": "http" },
  { "network": "avax", "url": "https://avalanche.drpc.org", "type": "http" },
  { "network": "merlin", "url": "http://alb-merlin-temp-rpc-139305638.ap-southeast-1.elb.amazonaws.com", "type": "http" },
  { "network": "blast", "url": "https://rpc.blast.io", "type": "http" },
  { "network": "metis", "url": "https://metis-pokt.nodies.app", "type": "http" },
  { "network": "metis", "url": "https://metis.api.onfinality.io/public", "type": "http" },
  { "network": "metis", "url": "https://metis-mainnet.public.blastapi.io", "type": "http" },
  { "network": "merlin", "url": "https://rpc.merlinchain.io", "type": "http" },
  { "network": "linea", "url": "https://linea.blockpi.network/v1/rpc/public", "type": "http" },
  { "network": "linea", "url": "https://linea.drpc.org", "type": "http" },
  { "network": "bnb", "url": "https://alpha-dawn-yard.bsc.quiknode.pro/9204d6f473c02267a07deab9bf8f3f42ed391862", "type": "http" },
  { "network": "b2", "url": "https://rpc.ankr.com/b2/0736cf6d3d3d0f6051b4f1d8cfe097912d81728009b39f4f0b1ad0ec7d1e480c", "type": "http" },
  { "network": "b2", "url": "https://rpc.bsquared.network", "type": "http" },
  { "network": "b2", "url": "https://mainnet.b2-rpc.com", "type": "http" },
  { "network": "sui", "url": "https://fullnode.mainnet.sui.io:443", "type": "http" },
  { "network": "cronos", "url": "https://cronos.drpc.org", "type": "http" },
  { "network": "cronos", "url": "https://evm.cronos.org", "type": "http" },
  { "network": "zkfair_", "url": "https://zkfair.blockpi.network/v1/rpc/public", "type": "http" },
  { "network": "zkfair", "url": "https://rpc.zkfair.io", "type": "http" },
  { "network": "solana", "url": "https://solemn-winter-road.solana-mainnet.quiknode.pro/46fa061ea3ca4552da78cde720d7d3e6ea1c6265", "type": "http" },
  { "network": "aptos", "url": "https://polished-omniscient-scion.aptos-mainnet.quiknode.pro/d09bc70f08aa2bd38c39c664e78038b44a4a3fc7", "type": "http" },
  { "network": "tron", "url": "https://rpc.ankr.com/premium-http/tron/0736cf6d3d3d0f6051b4f1d8cfe097912d81728009b39f4f0b1ad0ec7d1e480c", "type": "http" }
]


const rpc = { "network": "eth", "url": "https://rpc.ankr.com/eth", "type": "http" }
const optRpc = { "network": "opt", "url": "https://optimism.api.onfinality.io/public", "type": "http" }

const okxContract = `0xf956D9FA19656D8e5219fd6fa8bA6cb198094138`
const mesonContract = `0x25aB3Efd52e6470681CE037cD546Dc60726948D3`.toLowerCase()

const transactions = [];
let blockNumber = 126566990;

async function getLogs () {
  const provider = new ethers.providers.JsonRpcProvider(optRpc.url);
  blockNumber = blockNumber || await provider.getBlockNumber()
  console.log(blockNumber)
  const logs = await provider.getLogs({ fromBlock: blockNumber - 1000, toBlock: blockNumber , address: okxContract })
  for (const log of logs) {
    provider.getTransaction(log.transactionHash).then(tx => {
      if(String(tx.from).toLowerCase() === mesonContract) {
        transactions.push(tx)
      }
    })
  }
}

async function getTransactions() {
  const provider = new ethers.providers.JsonRpcProvider(rpc.url);
  provider.getLogs({
    address: ''
  })
}

async function getBlock(blockNumber = 126597066) {
  const provider = new ethers.providers.JsonRpcProvider(rpc.url);
  const block = await provider.getBlock(blockNumber)
  console.log(block)
}

async function getTransaction(hash = `0xbee1b3c7598d6eb414bd0fbdab80ab202a1cc7486bc8db9a4c9403914c52edaa`) {
  const provider = new ethers.providers.JsonRpcProvider(rpc.url);
  const tx = await provider.getTransaction(hash)
  const receipt = await provider.getTransactionReceipt(hash);
  console.log(receipt, tx)
}

async function main () {
  // getTransaction()
  // getBlock()

  while (true) {
    await getLogs(blockNumber)
    blockNumber = blockNumber - 1000
    if(transactions.length > 0) { break; }
  }
  console.log(transactions)
}
try {
  main()
} catch (e) {
  console.error(e)
}