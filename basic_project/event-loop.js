const fs = require("fs");
const crypto = require("crypto");
const { fileURLToPath } = require("url");
const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 4;
setTimeout(() => console.log("Timer finishedd"), 0);
setImmediate(() => console.log("Immediate one finished"));

fs.readFile("text-file.txt", () => {
  console.log("I/O finished");
  setTimeout(() => console.log("Timer 2 finishedd"), 0);
  setTimeout(() => console.log("Timer 3 finishedd"), 300);

  setImmediate(() => console.log("Immediate one finished"));
  process.nextTick(() => console.log("PRocess.nextTick"));
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  });
});
console.log("Hello from top level code");
//  and that is that the event loop
// actually waits for stuff to happen in the poll phase.
// So in that phase where I/O callbacks are handled.
// So when this queue of callbacks is empty,
// which is the case in our fictional example here,
// so we have no I/O callbacks, all we have
// is these timers, well then the event loop
// will wait in this phase until there is an expired timer.
// But, if we scheduled a callback using setImmediate,
// then that callback will actually be executed
// right away after the polling phase,
// and even before expired timers, if there is one.
// And in this case, the timer expires right away,
// so after zero seconds, but again, the event loop
// actually waits, so it pauses in the polling phase.
// And so that setImmediate callback
// is actually executed first, so that is the whole reason
// why we have this immediate here after we have the timers.
// nextTick is part
// of the microtasks queue, which get executed
// after each phase, so not just after one entire tick.
// And so what happened here is that this callback function
// actually ran before the phase where this callback function
// here ran, and the phase before that, okay.
// Now nextTick is actually really a misleading name,
// because a tick is actually an entire loop,
// but nextTick actually happens before the next loop phase,
// and not the entire tick, so that's what I was saying before.
// Then on the other side, setImmediate would make you think
// that it's callback would be executed immediately,
// but it actually doesn't, right, so setImmediate
// actually gets executed once per tick,
// while nextTick gets executed immediately.
// And so their two names should actually be switched.
// They should be the other way aroun
