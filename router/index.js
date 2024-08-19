const controller = require('../controller');

function handleNotFound(req, res) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('404 Not Found\n');
    res.end();
}

function router(req, res) {
    const url = req.url;
    const method = req.method;
    console.log(url, method)
    if (url === '/api/create' && method === 'POST') {
        controller.handleCreate(req, res);
    } else if (url === '/api/read' && method === 'GET') {
        controller.handleRead(req, res);
    } else if (url === '/api/update' && method === 'PUT') {
        controller.handleUpdate(req, res);
    } else if (url === '/api/delete' && method === 'DELETE') {
        controller.handleDelete(req, res);
    } else {
        handleNotFound(req, res);
    }
}
module.exports = router;