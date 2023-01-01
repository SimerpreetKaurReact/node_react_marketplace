const EventEmitter = require("events");
// const myEmitter = new EventEmitter();
const http = require("http");
class Sales extends EventEmitter {
  constructor() {
    super();
  }
}
const myEmitter = new Sales();
myEmitter.on("newSale", () => {
  console.log("There is a new sale");
});
myEmitter.on("newSale", () => {
  console.log("Customer is some guy");
});
myEmitter.on("newSale", (stock) => {
  console.log("There is a new sale", stock);
});
myEmitter.emit("newSale", 9);

///
const server = http.createServer();
server.on("request", (req, res) => {
  console.log("request received");
  res.end("request received");
});
server.on("request", (req, res) => {
  console.log("Another request");
});

server.on("close", () => {
  console.log("Server closed");
});
server.listen(8000, "127.0.0.1", () => {
  console.log("Waiting for request");
});
// there are certain objects called event emitters that emit named events as soon as something important
//happens in the app, like a request hitting server, or a timer expiring, or a file finishing to read.
// These events can then be picked up by event listeners that we developers set up, which will fire off
// callback functions that are attached to each listener, okay. So again, on one hand, we have event emitters,
// and on the other hand event listeners that will react  to emitted events by calling callback function. this is callled the observer pattern
