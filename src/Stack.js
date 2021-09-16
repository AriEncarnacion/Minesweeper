// export default class Stack {
//   constructor() {
//     this.data = [];
//     this.top = 0;
//   }
//
//   push(e) {
//     this.data[this.top] = e;
//     this.top = this.top + 1;
//   }
//
//   length(){return this.top};
//
//   isEmpty(){
//     return this.top === 0;
//   }
//
//   pop() {
//     if(this.isEmpty() === false) {
//       this.top = this.top -1;
//       return this.data.pop();
//     }
//   }
//
//   print() {
//     let itr = this.top - 1;
//     while(itr >= 0) {
//       console.log(this.data[itr]);
//       itr--;
//     }
//   }
//
//   getTop() {
//     return this.data[this.top - 1]
//   }
// }