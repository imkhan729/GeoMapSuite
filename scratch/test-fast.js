const http = require('http');

const urls = process.argv.slice(2);
if (urls.length === 0) {
  console.log('No URLs provided');
  process.exit(0);
}

Promise.all(urls.map(u => new Promise(resolve => {
  http.get('http://localhost:3000' + u, res => {
    console.log(`[${res.statusCode}] ${u}`);
    resolve({ u, status: res.statusCode });
  }).on('error', err => {
    console.log(`[ERR] ${u}: ${err.message}`);
    resolve({ u, status: 'ERR' });
  });
}))).then(() => {
  console.log('Done checking batch.');
});
