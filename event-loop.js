const fs = require('fs');
const crypto = require('crypto');
const { fileURLToPath } = require('url');
const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 4;
setTimeout(() => console.log('Timer finishedd'), 0);
setImmediate(() => console.log('Immediate one finished'));

fs.readFile('text-file.txt', () => {
  console.log('I/O finished');
  setTimeout(() => console.log('Timer 2 finishedd'), 0);
  setTimeout(() => console.log('Timer 3 finishedd'), 300);

  setImmediate(() => console.log('Immediate one finished'));
  process.nextTick(() => console.log('PRocess.nextTick'));
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password encrypted');
  });
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password encrypted');
  });
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password encrypted');
  });
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password encrypted');
  });
});
console.log('Hello from top level code');
