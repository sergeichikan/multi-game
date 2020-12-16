import { Follower } from "./follower.js";
const canvasDiagonal = Math.sqrt(Math.pow(800, 2) + Math.pow(800, 2));
export class FireBallFollower extends Follower {
    constructor(from, to, delta, stepLength = FireBallFollower.defaultStepLength) {
        super(from, stepLength);
        this.setTarget(to);
        this.from = this.getPointOnLine(delta);
    }
    setTarget(target) {
        super.setTarget(target);
        const point = this.getPointOnLine(canvasDiagonal);
        super.setTarget(point);
    }
}
FireBallFollower.defaultStepLength = 6;
//# sourceMappingURL=fire-ball-follower.js.map