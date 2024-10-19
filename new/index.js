import { writeFile } from 'fs/promises';

import mantaPromise from "./manta.js";
import xlayerPromise from "./xlayer.js";
import scrollPromise from "./scroll.js";
import avaxPromise from "./avax.js";
import optPromise from './op-mainnet.js';
import zetaPromise from './zeta.js';
import corePromise from './core.js';

(async () => {
  const days = Number(process.env.DAYS || 1);
  days > 1 ?
    console.log(`About to query data from the last ${days} days.`)
    : console.log(`About to query data from the last day.`)
  const fileName = (new Date()).toLocaleDateString().replaceAll('/', '') + '.txt'
  writeFile(fileName, JSON.stringify({
    manta: await mantaPromise,
    xlayer: await xlayerPromise,
    scroll: await scrollPromise,
    avax: await avaxPromise,
    opt: await optPromise,
    zeta: await zetaPromise,
    core: await corePromise,
  }, null, 2));
})()
