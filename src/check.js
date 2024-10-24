
import { readFile } from 'fs/promises';

export default async function check (args = {}) {

  const getCountsFileName = () => {
    return `log_count_${args.chainName}_${args.startBlock}-${args.endBlock}.json`;
  }

  function getListFileName () {
    //log_receipt_list_xlayer_5602448-5612448.json
    return `log_receipt_list_${args.chainName}_${args.startBlock}-${args.endBlock}.json`;
  }

  

}