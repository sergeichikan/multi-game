import { ServerResponse } from "http";

import { Wizard } from "./wizard.js";
import { FireBall } from "./fire-ball.js";
import { getRandomPoint } from "./get-random-point.js";
import { Point } from "./point.js";
import { Bomb } from "./bomb.js";

export class Game {

    public wizards: Wizard[];
    public responses: ServerResponse[];
    public fireBalls: FireBall[];
    public bombs: Bomb[];

    public constructor() {
        this.wizards = [];
        this.responses = [];
        this.fireBalls = [];
        this.bombs = [];
    }

    public tick() {
        this.wizards.forEach((wizard) => {
            wizard.follower.distance && wizard.follower.step();
        });

        this.fireBalls = this.fireBalls.filter((fireBall) => fireBall.follower.distance);
        this.fireBalls.forEach((fireBall: FireBall) => {
            fireBall.follower.distance && fireBall.follower.step();
        });
        this.fireBalls.forEach((fireBall: FireBall) => {
            this.wizards.forEach((wizard: Wizard) => {
                const distance: number = fireBall.follower.from.distance(wizard.follower.from);
                if (distance < wizard.radius + fireBall.radius) {
                    wizard.hp -= fireBall.damage;
                    fireBall.follower.stop();
                }
            });
        });

        this.bombs = this.bombs.filter(({ count }) => count > 0);
        this.bombs.forEach((bomb: Bomb) => {
            bomb.step();
        });
        this.bombs.forEach((bomb: Bomb) => {
            this.wizards.forEach((wizard: Wizard) => {
                const distance = bomb.from.distance(wizard.follower.from);
                if (distance < bomb.radius + wizard.radius) {
                    wizard.hp -= bomb.damage;
                }
            });
        });
    }

    public send() {
        const data = {
            wizards: this.wizards,
            fireBalls: this.fireBalls,
            bombs: this.bombs,
        };
        const json = JSON.stringify(data);
        this.responses.forEach((res: ServerResponse) => {
            res.write(`data: ${json}\n\n`);
        });
    }

    public getWizard(id: string): Wizard | undefined {
        return this.wizards.filter((wizard) => wizard.id === id)[0]
    }

    public run() {
        setInterval(() => {
            this.tick();
            this.send();
        }, 40);
    }

    public join(id: string) {
        const location = getRandomPoint();
        const wizard = new Wizard(location, id);
        this.wizards.push(wizard);
    }

    public target(id: string, point: { x: number, y: number }) {
        const wizard: Wizard | undefined = this.getWizard(id);
        if (!wizard) {
            throw new Error("invalid wizard");
        }
        wizard.follower.setTarget(Point.fromObj(point));
    }

    public fire(id: string, point: { x: number, y: number }) {
        const wizard: Wizard | undefined = this.getWizard(id);
        if (!wizard) {
            throw new Error("invalid wizard");
        }
        const target = Point.fromObj(point);
        const fireBall = new FireBall(wizard.follower.from, 9);
        fireBall.shift(target, wizard.radius);
        this.fireBalls.push(fireBall);
    }

    public bomb(id: string, target: Point) {
        const wizard: Wizard | undefined = this.getWizard(id);
        if (!wizard) {
            throw new Error("invalid wizard");
        }
        const bomb = new Bomb(target);
        this.bombs.push(bomb);
    }
}
