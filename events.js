const EventEmitter = require('events');
// const myEmitter = new EventEmitter();
const http = require('http');
class Sales extends EventEmitter {
  constructor() {
    super();
  }
}
const myEmitter = new Sales();
myEmitter.on('newSale', () => {
  console.log('There is a new sale');
});
myEmitter.on('newSale', () => {
  console.log('Customer is some guy');
});
myEmitter.on('newSale', (stock) => {
  console.log('There is a new sale', stock);
});
myEmitter.emit('newSale', 9);

///
const server = http.createServer();
server.on('request', (req, res) => {
  console.log('request received');
  res.end('request received');
});
server.on('request', (req, res) => {
  console.log('Another request');
});

server.on('close', () => {
  console.log('Server closed');
});
server.listen(8000, '127.0.0.1', () => {
  console.log('Waiting for request');
});
