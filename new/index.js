import { writeFile } from 'fs/promises';

import mantaPromise from "./manta.js";
import xlayerPromise from "./xlayer.js";
import scrollPromise from "./scroll.js";
import avaxPromise from "./avax.js";
import optPromise from './op-mainnet.js';
import zetaPromise from './zeta.js';

const manta = await mantaPromise;
const xlayer = await xlayerPromise;
const scroll = await scrollPromise;
const avax = await avaxPromise;
const opt = await optPromise;
const zeta = await zetaPromise;

(async () => {
  const fileName = (new Date()).toLocaleDateString() + '.txt'
  writeFile(fileName, JSON.stringify({
    manta,
    xlayer,
    scroll,
    avax,
    opt,
    zeta,
  }, null, 2));
})()
