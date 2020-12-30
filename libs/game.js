import { Wizard } from "./wizard.js";
import { FireBall } from "./fire-ball.js";
import { getRandomPoint } from "./get-random-point.js";
import { Point } from "./point.js";
import { Bomb } from "./bomb.js";
export class CoolDown {
    constructor(milliSeconds) {
        this.milliSeconds = milliSeconds;
        this.status = false;
    }
    run() {
        setTimeout(() => {
            this.status = false;
        }, this.milliSeconds);
        this.status = true;
    }
}
export class SkillCell {
    constructor(cooldown) {
        this.cooldown = cooldown;
    }
}
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
        this.bombs = this.bombs.filter(({ count }) => count > 0);
        this.bombs.forEach((bomb) => {
            bomb.step();
        });
        this.bombs.forEach((bomb) => {
            this.wizards.forEach((wizard) => {
                const distance = bomb.from.distance(wizard.follower.from);
                if (distance < bomb.radius + wizard.radius) {
                    wizard.hp -= bomb.damage;
                }
            });
        });
    }
    send() {
        const data = {
            wizards: this.wizards,
            fireBalls: this.fireBalls,
            bombs: this.bombs,
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
    fire(id, indexCell, point) {
        const wizard = this.getWizard(id);
        if (!wizard) {
            throw new Error("invalid wizard");
        }
        const cell = wizard.cells[indexCell];
        if (!cell.cooldown.status) {
            const fireBall = new FireBall(wizard.follower.from, 9);
            fireBall.shift(point, wizard.radius);
            this.fireBalls.push(fireBall);
            cell.cooldown.run();
        }
        else {
            throw new Error("cd");
        }
    }
    bomb(id, target) {
        const wizard = this.getWizard(id);
        if (!wizard) {
            throw new Error("invalid wizard");
        }
        const bomb = new Bomb(target);
        this.bombs.push(bomb);
    }
}
//# sourceMappingURL=game.js.map