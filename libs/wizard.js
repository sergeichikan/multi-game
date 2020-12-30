import { Follower } from "./follower.js";
export class Wizard {
    constructor(location, id) {
        this.id = id;
        this.follower = new Follower(location, 2);
        this.hp = 100;
        this.radius = 10;
        this.cells = [];
        // this.attack = false;
    }
}
//# sourceMappingURL=wizard.js.map