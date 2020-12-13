import { ServerResponse } from "http";

import { Wizard } from "./wizard.js";

export class Game {

    public wizards: Wizard[];
    public responses: ServerResponse[];

    public constructor() {
        this.wizards = [];
        this.responses = [];
    }

    public tick() {

    }

    public send() {
        const data = {};
        const json = JSON.stringify(data);
        this.responses.forEach((res: ServerResponse) => {
            res.write(`data: ${json}\n\n`);
        });
    }

    public run() {
        setInterval(() => {
            this.tick();
            this.send();
        }, 40);
    }
}
