import { Point } from "./point.js";

export class Line {

    public from: Point;
    public cos: number;
    public sin: number;

    constructor(from: Point) {
        this.from = from;
        this.cos = 0;
        this.sin = 0;
    }

    public rebuild(to: Point) {
        const angle: number = Math.atan2(to.y - this.from.y, to.x - this.from.x);
        this.cos = Math.cos(angle);
        this.sin = Math.sin(angle);
    }

    protected getPointOnLine(length: number): Point {
        const dx = this.cos * length;
        const dy = this.sin * length;
        return new Point(this.from.x + dx, this.from.y + dy);
    }
}
