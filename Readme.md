node: js runtime built on google's opensource v8 js engine
v8 engine compile this js code
libuv: event loop, thread pools

- single threaded based on event driven, non blocking I/O model
- And that makes NodeJS a perfect fit for building
  all different kinds of applications like
  building an API with a database behind it
  and preferably a non-relational NoSQL database like MongoDB
- when our app needs
  some super heavy server-side processing
  like having image manipulations, video conversion,
  file compression or anything like that, all right. these apps should not be built with node
- sychronous code/blocking code
- asynchrnous code/non blocking code
- async nature of nodejs
- node build around callbacks to implement async functionality
- node is single threaded, initilization of application starts the event loop which then offloads heavy/expensive tasks to 4 threads in the thread pool
  Event Loop: all heavy tasks like http request, timer expired, finished file reading once these are completed within the thread they emit events which are passed on to event loop to execute the callback functions
  All the code inside the callback functions
  node js is built around call backs
- event loop is what makes async programming possible in node
  event driven architecture

- events are emitted
- event loops pick them up
- callbacks are called
  event loop does the orchestration

## callback queues- has phases

- expired timer callback
- I/o polling callback
- set immediate callbacka
- close callbacks

* process. next tck queue
* microtask queue (resolve promised)
* the above 2 queues are priority queues they will commence when the current executing queue finishes, will not wait for all 4 queues to complete
  and a tick is basically just one cycle
  in this loop.
  So, now it's time to decide whether the loop should continue
  to the next tick or if the program should exit.
  And how does Node do that?
  Well, it's very simple.
  Node simply checks whether there are any timers
  or I/O tasks that are still running in the background,
  and if there aren't any, then it will exit the application.
  But if there are any pending timers or I/O tasks,
  well, then it will continue running the event loop
  and go straight to the next tick.
  or example, when we're listening
  for incoming HTTP requests
  we were basically running an I/O task,
  and that is why the event loop,
  and therefore, Node.js, keep running
  and keep listening for new HTTP requests coming in
  instead of just exiting the application.
  Also, when we're writing or reading a file
  in the background, that's also an I/O task,
  and so, it makes sense that the app doesn't exit
  while it's working with that file

# Streams

In Node, there are four fundamental types of streams:

- readable streams
- writable streams
- duplex streams- streams that are both readable and writeable eg websockets, And a web socket is basically just a communication channel
  between client and server that works in both directions
  and stays open once the connection has been established.
- transform streams: transform streams are duplex streams,
  so streams that are both readable and writeable,
  which at the same time can modify or transform
  the data as it is read or written.
  A good example of this one is the zlib core module
  to compress data which actually uses a transform stream.

# common js module system

require() exports, module.exports

# es module systems : import/ export

# Express:

minimal nodejs framework, basically built with a higher level of abstraction

- Middleware
  all the middleware together
  that we use in our app,
  is called the middleware Stack.
  What's very important to keep in mind here,
  is that the order of middleware in the stack,
  is actually defined by the order they
  are defined in the code.
  So a middleware that appears first in the code,
  is executed before one that appears later.
  And so the order of the code matters a lot in Express.s
  So when we call the next function,
  the next middleware in the stack will be executed
  with the exact same request and response object.
  And that happens with all the middlewares
  until we reach the last one.
  And so just like this,
  the initial request and response object
  go through each middleware step by step.
  And you can think of this whole process
  as kind of a pipeline where our data go through,
  so just like its been piped from request to final response.

# MVC architecture

- Application logic /controller: concerned only with applications implementations, not the underlying bussiness problem we are trying to solve
  concerned about managing req, res
  bridge between model and view layer
- Bussiness logic/model:directly related to business rules, how the business works and needs

# Fat Models/ Thin Controllers: offload as much logic as possible into models and keep the controllers as simple and lean as possible
