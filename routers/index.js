const controller = require('../controller');
const { routes, httpMethods } = require('../utils/constants');

function handleNotFound(request, response) {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.write('404 Not Found\n');
    response.end();
}

function router(request, response) {
    const url = request.url;
    const method = request.method;

    if (url === routes.CREATE && method === httpMethods.POST) {
        controller.handleCreate(request, response);
    } else if (url === routes.READ && method === httpMethods.POST) {
        controller.handleRead(request, response);
    } else if (url === routes.UPDATE && method === httpMethods.PUT) {
        controller.handleUpdate(request, response);
    } else if (url === routes.DELETE && method === httpMethods.DELETE) {
        controller.handleDelete(request, response);
    } else {
        handleNotFound(request, response);
    }
}
module.exports = router;