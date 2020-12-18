import { Point } from "./point.js";
import { Follower } from "./follower.js";

const canvasDiagonal = Math.sqrt(Math.pow(800, 2) + Math.pow(800, 2));

export class FireBall {

    public readonly follower: Follower;
    public damage: number;
    public radius: number;

    public constructor(from: Point, stepLength: number) {
        this.damage = 5;
        this.radius = 4;
        this.follower = new Follower(from, stepLength);
    }

    public shift(to: Point, length: number = 0) {
        this.follower.setTarget(to);
        this.follower.shiftTarget(canvasDiagonal);
        this.follower.shiftFrom(length + this.radius);
    }
}
