import { Point } from "../libs/point.js";
import { Wizard } from "../libs/wizard.js";
import { FireBall } from "../libs/fire-ball.js";
import { SpellCasting } from "./spell-casting.js";
import { initCanvas } from "./init-canvas.js";

const idInput = document.querySelector<HTMLInputElement>('input[id="idInput"]');
const joinButton = document.querySelector<HTMLButtonElement>('button[id="joinButton"]');
const closeButton = document.querySelector<HTMLButtonElement>('button[id="closeButton"]');
const addBotButton = document.querySelector<HTMLButtonElement>('button[id="addBotButton"]');
const hpSpan = document.querySelector<HTMLDivElement>('div[id="hpSpan"]');

if (!idInput || !joinButton || !closeButton || !hpSpan || !addBotButton) {
    throw new Error("invalid elements");
}

const { canvas, ctx } = initCanvas();

let game: {
    wizards: Wizard[];
    fireBalls: FireBall[];
    bombs: Bomb[];
} = {
    wizards: [],
    fireBalls: [],
    bombs: [],
};
const spellCasting = new SpellCasting();

document.addEventListener("keydown", (event: KeyboardEvent) => {
    spellCasting.keydown(event);
});

const eventSource = new EventSource("/sse");

eventSource.addEventListener("open", () => {
    console.log("[open]");
});
eventSource.addEventListener("message", ({ data }: MessageEvent) => {
    game = JSON.parse(data);
    hpSpan.innerHTML = game.wizards
        .map((wizard) => `${wizard.id}: ${wizard.hp}`)
        .join("<br>")
});
eventSource.addEventListener("error", (err) => console.log("[error]", err));

joinButton.addEventListener("click", () => {
    const id = idInput.value;
    const data = {
        id,
    };
    const body: string = JSON.stringify(data);
    return fetch("/join", {
        method: "POST",
        body,
    });
});

canvas.addEventListener("mousedown", (e: MouseEvent) => {
    const id = idInput.value;
    const point = Point.fromMouse(e, canvas.getBoundingClientRect());
    const data = {
        id,
        point,
    };
    const body: string = JSON.stringify(data);
    const url: string = spellCasting.getUrl();
    spellCasting.clear();
    return fetch(url, {
        method: "POST",
        body,
    });
});

const drawWizard = (wizard: Wizard, fillStyle: string) => {
    ctx.beginPath();
    ctx.arc(wizard.follower.from.x, wizard.follower.from.y, wizard.radius, 0, Math.PI * 2);
    ctx.fillStyle = fillStyle;
    ctx.fill();
    ctx.closePath();
};

const wizardDrawTarget = (wizard: Wizard) => {
    ctx.beginPath();
    ctx.arc(wizard.follower.to.x, wizard.follower.to.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
};

const wizardDrawPath = (wizard: Wizard) => {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(wizard.follower.from.x, wizard.follower.from.y);
    ctx.lineTo(wizard.follower.to.x, wizard.follower.to.y);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
};

const fireBallDraw = (fireBall: FireBall) => {
    ctx.beginPath();
    ctx.arc(fireBall.follower.from.x, fireBall.follower.from.y, fireBall.radius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
};

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.wizards.forEach((wizard) => {
        if (idInput.value === wizard.id) {
            drawWizard(wizard, "green");
        } else {
            drawWizard(wizard, "blue");
        }
        wizardDrawTarget(wizard);
        wizardDrawPath(wizard);
    });
    game.fireBalls.forEach(fireBallDraw);
    requestAnimationFrame(draw);
};

draw();
