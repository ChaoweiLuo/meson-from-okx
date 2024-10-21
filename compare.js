import list from './temp/list.json' assert { type: "json" };
import list2 from './temp/list2.json' assert { type: "json" };

console.log(list.length, list2.length)



const t_not_o = list2.filter( i => !list.find( j => j === i));
console.log('t_not_o', t_not_o)