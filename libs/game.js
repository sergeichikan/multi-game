export class Game {
    constructor() {
        this.wizards = [];
        this.responses = [];
    }
    tick() {
        this.wizards.forEach((wizard) => {
            wizard.follower.distance && wizard.follower.step();
        });
    }
    send() {
        const data = {
            wizards: this.wizards,
        };
        const json = JSON.stringify(data);
        this.responses.forEach((res) => {
            res.write(`data: ${json}\n\n`);
        });
    }
    run() {
        setInterval(() => {
            this.tick();
            this.send();
        }, 40);
    }
}
//# sourceMappingURL=game.js.map