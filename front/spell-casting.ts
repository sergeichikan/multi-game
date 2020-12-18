export class SpellCasting {

    public keyUrlMap: Map<string, string>;
    public keyboardCode: string;
    public defaultUrl: string;

    constructor() {
        this.keyboardCode = "";
        this.keyUrlMap = new Map([
            // ["KeyW", "/blink"],
            ["KeyR", "/fire"],
            ["KeyE", "/bomb"],
        ]);
        this.defaultUrl = "/target";
    }

    public keydown({ code }: KeyboardEvent) {
        this.keyboardCode = code;
    }

    public clear() {
        this.keyboardCode = "";
    }

    public getUrl(): string {
        return this.keyUrlMap.get(this.keyboardCode) || this.defaultUrl
    }
}
