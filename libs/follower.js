import { LineSegment } from "./line-segment.js";
export class Follower extends LineSegment {
    constructor(from, stepLength) {
        super(from);
        this.stepLength = stepLength;
    }
    step() {
        const isLastStep = this.distance < this.stepLength;
        const localStepLength = isLastStep ? this.distance : this.stepLength;
        this.from = this.getPointOnLine(localStepLength);
        this.distance = isLastStep ? 0 : this.from.distance(this.to);
    }
    stop() {
        this.reset();
    }
    shiftTarget(length) {
        const point = this.getPointOnLine(length);
        this.setTarget(point);
    }
    shiftFrom(length) {
        this.from = this.getPointOnLine(length);
    }
}
//# sourceMappingURL=follower.js.map