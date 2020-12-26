import { createServer } from "http";
import { sendFile } from "./send-file.js";
import { getBody } from "./libs/get-body.js";
import { Game } from "./libs/game.js";
import { Point } from "./libs/point.js";
// const host = "localhost";
const port = 3000;
const server = createServer();
const game = new Game();
server.on("request", (req, res) => console.log(req.method, req.url));
server.on("request", (req, res) => {
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
const join = async (req, res) => {
    const { id } = await getBody(req);
    return game.join(id);
};
const target = async (req, res) => {
    const { id, point } = await getBody(req);
    game.target(id, point);
    return res.end("true");
};
const fire = async (req, res) => {
    const { id, point } = await getBody(req);
    game.fire(id, point);
    return res.end("true");
};
const notFound = async (req, res) => {
    res.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8",
    });
    res.end("not found");
};
const bomb = async (req, res) => {
    const { id, point } = await getBody(req);
    const target = Point.fromObj(point);
    game.bomb(id, target);
    res.end();
};
const postHandler = new Map([
    ["/join", join],
    ["/target", target],
    ["/fire", fire],
    ["/bomb", bomb],
]);
server.on("request", (req, res) => {
    if (req.method !== "POST") {
        return;
    }
    const url = req.url || "";
    const handler = postHandler.get(url) || notFound;
    return handler(req, res).catch((err) => {
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(JSON.stringify(err.message));
    });
});
server.listen(port, () => {
    console.log(`http://localhost:${port}`);
    game.run();
});
//# sourceMappingURL=server.js.map