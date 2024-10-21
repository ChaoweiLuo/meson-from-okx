import { getResult } from './contract.js';
import * as configs from './config.js';

void async function main() {
  const args = process.argv
  if(args.length !== 4) {
    console.log('error')
  } else {
    const [_, __, configName, tokenName] = process.argv;
    const config = configs[configName];
    const token = config.tokens[tokenName];
    const result = await getResult({ ...config, token })
    console.dir(result);
  }
}()



