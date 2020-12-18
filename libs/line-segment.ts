import { Point } from "./point.js";
import { Line } from "./line.js";

export class LineSegment extends Line {

    public to: Point;
    public distance: number;

    constructor(from: Point) {
        super(from);
        this.to = this.from;
        this.distance = 0;
    }

    public rebuild(to: Point) {
        this.distance = this.from.distance(this.to);
        super.rebuild(to);
    }

    public setTarget(target: Point) {
        this.to = target;
        this.rebuild(this.to);
    }

    public reset() {
        this.to = this.from;
        this.distance = 0;
    }
}
