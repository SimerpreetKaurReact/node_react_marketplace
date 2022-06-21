const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');
const slugify = require('slugify');
//require  function path from current working directory
// .is where script is running except require function
//followign is top level code and will be executed only once, at begining of app function so
// can be sync in nature or blocking

const tempOverview = fs.readFileSync(
  './templates/template-overview.html',
  'utf-8'
);
const tempCard = fs.readFileSync('./templates/template-card.html', 'utf-8');
const tempProduct = fs.readFileSync(
  './templates/template-product.html',
  'utf-8'
);

const fileData = fs.readFileSync('./dev-data/data.json', 'utf-8');
const fileDataObj = JSON.parse(fileData);
const slugs = fileDataObj.map((el) => el.productName, { lower: true });
console.log(slugs);
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === '/overview') {
    const cardHtml = fileDataObj
      .map((ele) => replaceTemplate(tempCard, ele))
      .join('');
    const output = tempOverview.replace(`{%PRODUCT_CARD%}`, cardHtml);
    res.writeHead(200, { 'Content-type': `text/html` });
    res.end(output);
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': `text/html` });
    const product = fileDataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    console.log(product, query.id);
    res.end(output);
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': `application/json` });

    res.end(fileData);
    // fs.readFile(`${__dirname}/dev-data/data.json`, "utf-8", (err, data) => {
    //   const productData = JSON.parse(data);
    //   res.writeHead(200, { "Content-type": `application/json` });
    //   console.log(productData);
    //   res.end(data);
    // });
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
    });
    res.end(`<h1>Page not found!!</h1>`);
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000 ');
});

//major.minor,patch version
//^accpts only minpr and patch releases
//~accepts only patch changes
//*accepts all
