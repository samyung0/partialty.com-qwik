import _JS, { $ as JS } from "./JS/@babel-parser-7.23.0";
export { JS, _JS };
// export const $compare = (obj: any, original: any) => {
//   for(const key of obj) {
//     if(key.startsWith("$_$")) continue;
//     if(!Object.prototype.hasOwnProperty.call(original, key)) {
//       obj.$_$errorFn?.();
//       return false;
//     }
//     if(Array.isArray(obj[key])) {
//       if(!Array.isArray(original[key])) {
//         obj.$_$errorFn?.();
//         return false;
//       }
//       let valid = Array.from(Array(obj[key].length)).map(_ => false);
//       let index = 0;
//       for(let i=0;i<obj[key].length,index<original[key].length;i++) {
//         while(index < original[key].length) {

//         }
//       }
//     }
//   }
// }
