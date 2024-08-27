const { createServer } = require('node:http');
const router = require('./routers');

const hostname = '127.0.0.1';
const port = 8080;

const server = createServer((request, response) => {
    router(request, response);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});