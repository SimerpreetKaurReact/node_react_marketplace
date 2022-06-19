const fs = require('fs');

//Blocking synchronous code
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(textIn);
const textOut = `This is what we know about avocado:${textIn},\n Created On ${new Date()}`;
fs.writeFileSync('./txt/output.txt', textOut);
console.log('Output written');

//sychronous code/blocking code
//asynchrnous code/non blocking code
//async nature of nodejs
//node build around callbacks to implement async functionality

//unblocking asynchronous code

fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
  if (err) return console.log(err);
  console.log(data);
  fs.readFile(`./txt/${data}.txt`, 'utf-8', (err, data1) => {
    console.log(data1);
    fs.readFile(`./txt/append.txt`, 'utf-8', (err, data2) => {
      console.log(data2);
      fs.writeFile('./txt/newFile.txt', `${data1}\n ${data2}`, 'utf-8', (err) =>
        console.log(err)
      );
    });
  });
});
console.log('asynchronous file read');
//execution queues in callback sequence
//Expired timeer queue, I/O polling and callbacks, setimmediate callbacks, close callbacks
//Dont use sync versions of functions in fs,crypto,zlib modules
//Dont perform complex calculations (eg loops inside loops
// be careful with Json in large Objects
//Dont use too complex regular expressions(eg nested quantifiers)
