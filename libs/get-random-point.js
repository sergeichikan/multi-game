import { Point } from "./point.js";
import { random } from "./random.js";
export const getRandomPoint = () => {
    return new Point(random(0, 800), random(0, 800));
};
//# sourceMappingURL=get-random-point.js.map