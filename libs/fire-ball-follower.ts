import { Follower } from "./follower.js";
import { Point } from "./point.js";

const canvasDiagonal = Math.sqrt(Math.pow(800, 2) + Math.pow(800, 2));

export class FireBallFollower extends Follower {

    public static readonly defaultStepLength: number = 9;

    public constructor(from: Point, to: Point, delta: number, stepLength: number = FireBallFollower.defaultStepLength) {
        super(from, stepLength);
        this.setTarget(to);
        this.from = this.getPointOnLine(delta);
    }

    public setTarget(target: Point) {
        super.setTarget(target);
        const point = this.getPointOnLine(canvasDiagonal);
        super.setTarget(point);
    }
}
