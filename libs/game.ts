import { ServerResponse } from "http";

import { Wizard } from "./wizard.js";
import {FireBall} from "./fire-ball";

export class Game {

    public wizards: Wizard[];
    public responses: ServerResponse[];
    public fireBalls: FireBall[];

    public constructor() {
        this.wizards = [];
        this.responses = [];
        this.fireBalls = [];
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
                }
            });
        });
    }

    public send() {
        const data = {
            wizards: this.wizards,
            fireBalls: this.fireBalls,
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
}
