import { createServer, ServerResponse, IncomingMessage } from "http";

import { sendFile } from "./send-file.js";
import { getBody } from "./libs/get-body.js";
import { Game } from "./libs/game.js";
import { Point } from "./libs/point.js";

// const host = "localhost";
const port = 3000;
const server = createServer();

const game = new Game();

server.on("request", (req, res) => console.log(req.method, req.url));

server.on("request", (req: IncomingMessage, res: ServerResponse) => {
    if (req.method !== "GET") {
        return;
    }
    if (req.url === "/") {
        return sendFile("/front/index.html", res);
    }
    if (req.url === "/sse") {
        res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
        res.setHeader("Cache-Control", "no-cache");
        game.responses.push(res);
        return;
    }
    return sendFile(req.url || "", res).catch((err) => res.end(JSON.stringify(err.message)));
});

const join = async (req: IncomingMessage, res: ServerResponse) => {
    const { id } = await getBody<{ id: string }>(req);
    return game.join(id);
};
const target = async (req: IncomingMessage, res: ServerResponse) => {
    const { id, point } = await getBody<{ point: { x: number, y: number }, id: string }>(req);
    game.target(id, point);
    return res.end("true");
};
const fire = async (req: IncomingMessage, res: ServerResponse) => {
    const { id, point, indexCell } = await getBody<{ id: string, point: { x: number, y: number }, indexCell: number }>(req);
    const target = Point.fromObj(point);
    game.fire(id, indexCell, target);
    return res.end("true");
};
const notFound = async (req: IncomingMessage, res: ServerResponse) => {
    res.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8",
    })
    res.end("not found");
};
const bomb = async (req: IncomingMessage, res: ServerResponse) => {
    const { id, point } = await getBody<{ id: string, point: { x: number, y: number } }>(req);
    const target: Point = Point.fromObj(point);
    game.bomb(id, target);
    res.end();
};
const postHandler = new Map<string, (req: IncomingMessage, res: ServerResponse) => Promise<unknown>>([
    ["/join", join],
    ["/target", target],
    ["/fire", fire],
    ["/bomb", bomb],
]);

server.on("request", (req: IncomingMessage, res: ServerResponse) => {
    if (req.method !== "POST") {
        return;
    }
    const url: string = req.url || "";
    const handler = postHandler.get(url) || notFound;
    return handler(req, res).catch((err) => {
        res.setHeader("Content-Type", "application/json; charset=utf-8")
        res.end(JSON.stringify(err.message));
    });
});

server.listen(port, () => {
    console.log(`http://localhost:${port}`);
    game.run();
});
