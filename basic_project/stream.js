const fs = require("fs");
const server = require("http").createServer();
const readable = fs.createReadStream("test-file.txt");
// server.on("request", (req, res) => {
//   readable.on("data", (chunk) => {
//     res.write(chunk);
//   });
//   readable.on("end", () => {
//     res.end();
//   });
//   readable.on("error", (err) => {
//     console.log(err);
//     res.statusCode = 500;
//     res.end("File not found");
//   });
// });
//solution using pipe
server.on("request", (req, res) => {
  const readable = fs.createReadStream("test-file.txt");
  readable.pipe(res);
  //readableSource.pipe(writeableDest)
});
server.listen(8001, "127.0.0.1", () => {
  console.log("Waiting for request");
});

//causes backpresure, response cannot send data as fast as it is receiving from the file
//each js file is treated as a seperate module
// node.js uses the common js module system:require(),exports or module.exports
// es module system is used in browser : import/export
//resolving& loading: 1. core modules2.  developer modules,3. 3rd party modules
//wrapping: module code wraps exports,require,exports __filename,__dirname
//each module has its private scope
//__filename: absolute path of the current modules file name
//__dirname :  current module's directory name
//exection
//retuning exports: module.exports return object
//use module.exports to export one single variable eg one class or one function(module.exports=Calculator)
//use exports to export multiple  named variables (exports,add=(a,b)=>a+b)

//caching: if we require same module multiple times in same module
// instead of waiting until the entire video file loads,
// the processing is done piece by piece or in chunks
// so that you can start watching even before the entire file
// has been downloaded.
// Also, streaming make the data processing more efficient
// in terms of memory because there is no need
// to keep all the data in memory and also in terms of time
// In Node, there are four fundamental types of streams:
// readable streams, writable streams, duplex streams,
// and transform streams.
// But the readable and writeable ones
// are the most important ones.
