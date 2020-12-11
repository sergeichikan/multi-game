import { createServer, ServerResponse, IncomingMessage } from "http";

import { sendFile } from "./send-file.js";

const host = "localhost";
const port = 3000;
const server = createServer();

server.on("request", (req, res) => console.log(req.method, req.url));

server.on("request", async (req: IncomingMessage, res: ServerResponse) => {
    if (req.url === "/") {
        return sendFile("/front/index.html", res);
    }
    return sendFile(req.url || "", res);
});

server.listen(port, () => {
    console.log(`http://${host}:${port}`);
});
