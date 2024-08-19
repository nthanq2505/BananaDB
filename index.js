const { createServer } = require('node:http');
const router = require('./router');

const hostname = '127.0.0.1';
const port = 6000;

const server = createServer((req, res) => {
    router(req, res);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});