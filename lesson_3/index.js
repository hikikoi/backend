// // const fruits_ = ['olma', 'anor', 'gilos']
// // console.log(fruits);

// const fruits = ['olma', 'anor', 'gilos','olma', 'anor', 'gilos','banan', 'kiwi', 'gilos'];

// function sorter(fruits) {
//     let result = [];

//     for(let fruit of fruits){
//         if(!result.includes(fruit)){
//             result.push(fruit)
//         }
//     }

//     return result
// }

// console.log(sorter(fruits));


let str = "Hello World !";
let num = [1,7,3];

function encrypt(num, str){
    word = [];
    num.sort((a,b) => a -b);
    str = str.split('')
    word.push(str)
    word.split('');
    return word;
}

console.log(encrypt(num, str));
