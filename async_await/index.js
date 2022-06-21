const fs = require("fs");
const superagent = require("superagent");
// fs.readFile("./dog.txt", (err, data) => {
//   console.log(`breed: ${data}`);
//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .end((err, res) => {
//       if (err) return console.log(err.message);
//       console.log(res.body.message);
//       fs.writeFile("dog-img.txt", res.body.message, (err) => {
//         console.log("image saved to file");
//       });
//     });
// });

// fs.readFile("./dog.txt", (err, data) => {
//   console.log(`breed: ${data}`);
//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .then((res) => {
//       fs.writeFile("dog-img.txt", res.body.message, (err) => {
//         console.log("image saved to file");
//       });
//     })
//     .catch((err) => console.log(err.message));
// });
//promises
