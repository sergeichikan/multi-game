import { Wizard } from "./wizard.js";
import { FireBall } from "./fire-ball.js";
import { getRandomPoint } from "./get-random-point.js";
import { Point } from "./point.js";
export class Game {
    constructor() {
        this.wizards = [];
        this.responses = [];
        this.fireBalls = [];
        this.bombs = [];
    }
    tick() {
        this.wizards.forEach((wizard) => {
            wizard.follower.distance && wizard.follower.step();
        });
        this.fireBalls = this.fireBalls.filter((fireBall) => fireBall.follower.distance);
        this.fireBalls.forEach((fireBall) => {
            fireBall.follower.distance && fireBall.follower.step();
        });
        this.fireBalls.forEach((fireBall) => {
            this.wizards.forEach((wizard) => {
                const distance = fireBall.follower.from.distance(wizard.follower.from);
                if (distance < wizard.radius + fireBall.radius) {
                    wizard.hp -= fireBall.damage;
                    fireBall.follower.stop();
                }
            });
        });
        this.bombs = this.bombs.filter((bomb) => bomb.radius);
        this.bombs.forEach((bomb) => {
            // bomb.radius 10 20 30 0
            bomb.step();
        });
        // начисление урона по магам
    }
    send() {
        const data = {
            wizards: this.wizards,
            fireBalls: this.fireBalls,
            bomb: this.bomb,
        };
        const json = JSON.stringify(data);
        this.responses.forEach((res) => {
            res.write(`data: ${json}\n\n`);
        });
    }
    getWizard(id) {
        return this.wizards.filter((wizard) => wizard.id === id)[0];
    }
    run() {
        setInterval(() => {
            this.tick();
            this.send();
        }, 40);
    }
    join(id) {
        const location = getRandomPoint();
        const wizard = new Wizard(location, id);
        this.wizards.push(wizard);
    }
    target(id, point) {
        const wizard = this.getWizard(id);
        if (!wizard) {
            throw new Error("invalid wizard");
        }
        wizard.follower.setTarget(Point.fromObj(point));
    }
    fire(id, point) {
        const wizard = this.getWizard(id);
        if (!wizard) {
            throw new Error("invalid wizard");
        }
        const target = Point.fromObj(point);
        const fireBall = new FireBall(wizard.follower.from, 9);
        fireBall.shift(target, wizard.radius);
        this.fireBalls.push(fireBall);
    }
}
//# sourceMappingURL=game.js.map