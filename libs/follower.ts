import { Point } from "./point.js";
import { LineSegment } from "./line-segment.js";

export class Follower extends LineSegment {

    public stepLength: number;

    public constructor(from: Point, stepLength: number) {
        super(from)
        this.stepLength = stepLength;
    }

    public step() {
        const isLastStep: boolean = this.distance < this.stepLength;
        const localStepLength: number = isLastStep ? this.distance : this.stepLength;
        this.from = this.getPointOnLine(localStepLength);
        this.distance = isLastStep ? 0 : this.from.distance(this.to);
    }

    public stop() {
        this.reset();
    }

    public shiftTarget(length: number) {
        const point = this.getPointOnLine(length);
        this.setTarget(point);
    }

    public shiftFrom(length: number) {
        this.from = this.getPointOnLine(length);
    }
}
