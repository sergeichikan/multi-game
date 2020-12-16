import { FireBallFollower } from "./fire-ball-follower.js";
export class FireBall {
    constructor(from, to, wizardRadius = 0, stepLength) {
        this.damage = 5;
        this.radius = 4;
        const delta = wizardRadius + this.radius;
        this.follower = new FireBallFollower(from, to, delta, stepLength);
    }
}
//# sourceMappingURL=fire-ball.js.map