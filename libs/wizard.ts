import { Follower } from "./follower.js";
import { Point } from "./point.js";
import {SkillCell} from "./game";

export class Wizard {

    public readonly id: string;
    public readonly follower: Follower;
    public hp: number;
    public radius: number;
    public cells: SkillCell[];

    public constructor(location: Point, id: string) {
        this.id = id;
        this.follower = new Follower(location, 2);
        this.hp = 100;
        this.radius = 10;
        this.cells = [];
        // this.attack = false;
    }

    // public

    // public blink(target: Point) {
    //     this.follower.from = target;
    //     this.follower.stop();
    // }
}
