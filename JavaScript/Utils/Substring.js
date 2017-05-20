// substring只有一个参数时，参数表示从字符串的第几位开始截取
let str = "Olive";
let result1 = str.substring(3); // result1 is "ve"

let res1 = str.substr(3);   // res1 is "ve"

/**
* [substring有两个参数时，
* 第一个参数表示从字符串的第几位开始截取，
* 第二个参数表示截取到字符串的第几位]
*/
let result2 = str.substring(3, 4); // result2 is "v"
let result3 = str.substring(3, 2); // result3 is "0"

let res2 = str.substring(3, 4); // res2 is "ve"
let res3 = str.substring(3, 2); // res3 is "ve"
/**
* [substr有两个参数时，
* 第一个参数表示从字符串的第几位开始截取，
* 第二个参数表示截取多少位字符串]
*/
