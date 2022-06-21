// console.log(arguments);
// console.log(require("module").wrapper);
const { add, multiply, divides } = require("./calc2");
const Calculator = require("./Calculator");
const calc1 = new Calculator();
console.log(calc1.add(2, 4));
console.log(multiply(2, 4));
//caching
require("./test")();
require("./test")();
require("./test")();
// hello from module
//Log this
//Log this
//Log this
//above is the output, since the module is loaded only once as cached, only the function is called three times
