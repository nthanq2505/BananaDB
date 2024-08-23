const fs = require("fs");

function generateId() {
    return Date.now().toString();
}

function handleRead(req, res) {
    const chunks = [];
    req.on("data", (chunk) => {
        chunks.push(chunk);
    });
    req.on("end", () => {
        const data = JSON.parse(Buffer.concat(chunks).toString());

        const collection = data.collection;
        const filter = data.filter;

        const path = `./database/${collection}.json`;

        fs.readFile(path, "utf8", (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err);
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.write("500 Internal Server Error\n");
                res.end();
                return;
            }

            const records = JSON.parse(jsonString);
            const filteredRecords = records.filter((record) => {
                let match = true;
                for (const key in filter) {
                    if (record[key] !== filter[key]) {
                        match = false;
                        break;
                    }
                }
                return match;
            });

            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(filteredRecords));
            res.end();
        });
    });
}

function handleCreate(req, res) {
    console.log("handleCreate");
    const chunks = [];
    req.on("data", (chunk) => {
        chunks.push(chunk);
    });
    req.on("end", () => {
        const data = JSON.parse(Buffer.concat(chunks).toString());

        const collection = data.collection;
        const record = data.record;

        const path = `./database/${collection}.json`;

        fs.readFile(path, "utf8", (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err);
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.write("500 Internal Server Error\n");
                res.end();
                return;
            }

            const records = JSON.parse(jsonString);
            const newRecord = {
                id: generateId(),
                ...record,
            };
            records.push(newRecord);

            fs.writeFile(path, JSON.stringify(records), (err) => {
                if (err) {
                    console.log("File write failed:", err);
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.write("500 Internal Server Error\n");
                    res.end();
                    return;
                }

                res.writeHead(201, { "Content-Type": "application/json" });
                res.write(JSON.stringify(newRecord));
                res.end();
            });
        });
    });
}

function handleUpdate(req, res) {
    const chunks = [];
    req.on("data", (chunk) => {
        chunks.push(chunk);
    });
    req.on("end", () => {
        const data = JSON.parse(Buffer.concat(chunks).toString());

        const collection = data.collection;
        const filter = data.filter;
        const update = data.update;

        const path = `./database/${collection}.json`;

        fs.readFile(path, "utf8", (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err);
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.write("500 Internal Server Error\n");
                res.end();
                return;
            }

            const records = JSON.parse(jsonString);
            const updatedRecords = records.map((record) => {
                let match = true;
                for (const key in filter) {
                    if (record[key] !== filter[key]) {
                        match = false;
                        break;
                    }
                }
                if (match) {
                    return { ...record, ...update };
                } else {
                    return record;
                }
            });

            fs.writeFile(path, JSON.stringify(updatedRecords), (err) => {
                if (err) {
                    console.log("File write failed:", err);
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.write("500 Internal Server Error\n");
                    res.end();
                    return;
                }

                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(updatedRecords));
                res.end();
            });
        });
    });
}

function handleDelete(req, res) {
    const chunks = [];
    req.on("data", (chunk) => {
        chunks.push(chunk);
    });
    req.on("end", () => {
        const data = JSON.parse(Buffer.concat(chunks).toString());

        const collection = data.collection;
        const filter = data.filter;

        const path = `./database/${collection}.json`;

        fs.readFile(path, "utf8", (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err);
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.write("500 Internal Server Error\n");
                res.end();
                return;
            }

            const records = JSON.parse(jsonString);
            const updatedRecords = records.filter((record) => {
                let match = true;
                for (const key in filter) {
                    if (record[key] !== filter[key]) {
                        match = false;
                        break;
                    }
                }
                return !match;
            });

            fs.writeFile(path, JSON.stringify(updatedRecords), (err) => {
                if (err) {
                    console.log("File write failed:", err);
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.write("500 Internal Server Error\n");
                    res.end();
                    return;
                }

                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(updatedRecords));
                res.end();
            });
        });
    });
}

module.exports = {
    handleRead,
    handleCreate,
    handleUpdate,
    handleDelete,
};
