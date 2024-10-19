import mantaPromise from "./manta.js";
import xlayerPromise from "./xlayer.js";
import scrollPromise from "./scroll.js";
import { writeFile } from 'fs/promises';

const manta = await mantaPromise;
const xlayer = await xlayerPromise;
const scroll = await scrollPromise;

(async () => {
  const fileName = (new Date()).toLocaleDateString() + '.txt'
  writeFile(fileName, JSON.stringify({ manta, xlayer, scroll }, null, 2));
})()
