// let array = [1, 2, 3, 4, 5, 6];

// class myArray {
//   constructor(array) {
//     this.array = array;
//   }

//   reverse() {
//     const reversed = [];
//     for (let i = this.array.length - 1; i >= 0; i--) {
//       reversed.push(this.array[i]);
//     }
//     return reversed;
//   }

//   sort() {
//     const sorted = [];
//     for(let i = 0; i < this.array;){
//         console.log();
//     }
//   }
// }

// const arrayRes = new myArray(array);

// console.log(arrayRes.reverse(array));

function Bricks(sm, bg, goal) {
  let oneInch = 1 * sm;
  let fiveInch = 5 * bg;
  let count = oneInch + fiveInch;

  if (fiveInch >= count) {
    return false;
  } else if(count >= goal ){
    return true;
  }else{
    return false;
  }
}

console.log(Bricks(1, 3, 13));
