export class Game {
    constructor() {
        this.wizards = [];
        this.responses = [];
        this.fireBalls = [];
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
    }
    send() {
        const data = {
            wizards: this.wizards,
            fireBalls: this.fireBalls,
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
}
//# sourceMappingURL=game.js.map