import { Follower } from "./follower.js";
const canvasDiagonal = Math.sqrt(Math.pow(800, 2) + Math.pow(800, 2));
export class FireBall {
    constructor(from, stepLength) {
        this.damage = 5;
        this.radius = 4;
        this.follower = new Follower(from, stepLength);
    }
    shift(to, length = 0) {
        this.follower.setTarget(to);
        this.follower.shiftTarget(canvasDiagonal);
        this.follower.shiftFrom(length + this.radius);
    }
}
//# sourceMappingURL=fire-ball.js.map