import { createServer, ServerResponse, IncomingMessage } from "http";

import { sendFile } from "./send-file.js";
import { Wizard } from "./libs/wizard.js";
import { Point } from "./libs/point.js";
import { getBody } from "./libs/get-body.js";
import { Game } from "./libs/game.js";

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

server.on("request", (req: IncomingMessage, res: ServerResponse) => {
    if (req.method !== "POST") {
        return;
    }
    if (req.url === "/join") {
        return getBody<{ id: string }>(req)
            .then((body) => {
                const id = body.id;
                const location = new Point(100, 100);
                const wizard = new Wizard(location, id);
                game.wizards.push(wizard);
            });
    }
    if (req.url === "/target") {
        return getBody<{ point: { x: number, y: number }, id: string }>(req)
            .then((body) => {
                const id: string = body.id;
                const point = body.point;
                const filteredWizards: Wizard[] = game.wizards.filter((wizard: Wizard) => wizard.id === id);
                // const wizard: Wizard | undefined = filteredWizards[0];
                filteredWizards.forEach((wizard) => {
                    wizard.follower.setTarget(Point.fromObj(point));
                });
                res.end("true");
            });
    }
    return;
});

server.listen(port, () => {
    console.log(`http://:${port}`);
    game.run();
});
