export class SpellCasting {
    constructor() {
        this.keyboardCode = "";
        this.keyUrlMap = new Map([
            // ["KeyW", "/blink"],
            ["KeyR", "/fire"],
            ["KeyE", "/bomb"],
        ]);
        this.defaultUrl = "/target";
    }
    keydown({ code }) {
        this.keyboardCode = code;
    }
    clear() {
        this.keyboardCode = "";
    }
    getUrl() {
        return this.keyUrlMap.get(this.keyboardCode) || this.defaultUrl;
    }
}
//# sourceMappingURL=spell-casting.js.map