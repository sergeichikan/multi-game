import { Point } from "./point";

export class Bomb {

    public radius: number;
    public delta: number;
    public count: number;
    public damage: number;
    public from: Point

    public constructor(from: Point) {
        this.radius = 10;
        this.delta = 10;
        this.count = 5;
        this.damage = 5;
        this.from = from;
    }

    public step() {
        this.radius += this.delta;
        this.count--;
    }
}
