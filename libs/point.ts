export class Point {

    public readonly x: number;
    public readonly y: number;

    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public distance({ x, y }: Point): number {
        return Math.sqrt(Math.pow(Math.abs(x - this.x), 2) + Math.pow(Math.abs(y - this.y), 2));
    }

    static readonly fromMouse = ({ clientX, clientY }: MouseEvent, { left, top }: DOMRect): Point => {
        return new Point(clientX - left, clientY - top);
    };

    static readonly fromObj = ({ x, y }: { x: number, y: number }): Point => {
        return new Point(x, y);
    };
}
