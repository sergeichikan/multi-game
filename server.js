import { createServer } from "http";
import { sendFile } from "./send-file.js";
import { Wizard } from "./libs/wizard.js";
import { Point } from "./libs/point.js";
import { getBody } from "./libs/get-body.js";
import { Game } from "./libs/game.js";
import { getRandomPoint } from "./libs/get-random-point.js";
import { FireBall } from "./libs/fire-ball.js";
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
server.on("request", (req, res) => {
    if (req.method !== "POST") {
        return;
    }
    if (req.url === "/join") {
        return getBody(req)
            .then((body) => {
            const id = body.id;
            const location = getRandomPoint();
            const wizard = new Wizard(location, id);
            game.wizards.push(wizard);
        });
    }
    if (req.url === "/target") {
        return getBody(req)
            .then((body) => {
            const id = body.id;
            const point = body.point;
            const wizard = game.getWizard(id);
            if (!wizard) {
                throw new Error("invalid wizard");
            }
            wizard.follower.setTarget(Point.fromObj(point));
            res.end("true");
        });
    }
    if (req.url === "/fire") {
        return getBody(req)
            .then(({ id, point }) => {
            const wizard = game.getWizard(id);
            if (!wizard) {
                throw new Error("invalid wizard");
            }
            const target = Point.fromObj(point);
            const fireBall = new FireBall(wizard.follower.from, target, wizard.radius);
            game.fireBalls.push(fireBall);
            res.end("true");
        });
    }
    return;
});
server.listen(port, () => {
    console.log(`http://localhost:${port}`);
    game.run();
});
//# sourceMappingURL=server.js.map