import { Point } from "../libs/point.js";
import { SpellCasting } from "./spell-casting.js";
import { initCanvas } from "./init-canvas.js";
const idInput = document.querySelector('input[id="idInput"]');
const joinButton = document.querySelector('button[id="joinButton"]');
const closeButton = document.querySelector('button[id="closeButton"]');
const addBotButton = document.querySelector('button[id="addBotButton"]');
const hpSpan = document.querySelector('div[id="hpSpan"]');
if (!idInput || !joinButton || !closeButton || !hpSpan || !addBotButton) {
    throw new Error("invalid elements");
}
const { canvas, ctx } = initCanvas();
let game = {
    wizards: [],
    fireBalls: [],
    bombs: [],
};
const spellCasting = new SpellCasting();
document.addEventListener("keydown", (event) => {
    spellCasting.keydown(event);
});
const eventSource = new EventSource("/sse");
eventSource.addEventListener("open", () => {
    console.log("[open]");
});
eventSource.addEventListener("message", ({ data }) => {
    game = JSON.parse(data);
    hpSpan.innerHTML = game.wizards
        .map((wizard) => `${wizard.id}: ${wizard.hp}`)
        .join("<br>");
});
eventSource.addEventListener("error", (err) => console.log("[error]", err));
joinButton.addEventListener("click", () => {
    const id = idInput.value;
    const data = {
        id,
    };
    const body = JSON.stringify(data);
    return fetch("/join", {
        method: "POST",
        body,
    });
});
canvas.addEventListener("mousedown", (e) => {
    const id = idInput.value;
    const point = Point.fromMouse(e, canvas.getBoundingClientRect());
    const data = {
        id,
        point,
    };
    const body = JSON.stringify(data);
    const url = spellCasting.getUrl();
    spellCasting.clear();
    return fetch(url, {
        method: "POST",
        body,
    });
});
const drawWizard = (wizard, fillStyle) => {
    ctx.beginPath();
    ctx.arc(wizard.follower.from.x, wizard.follower.from.y, wizard.radius, 0, Math.PI * 2);
    ctx.fillStyle = fillStyle;
    ctx.fill();
    ctx.closePath();
};
const drawBomb = (bomb) => {
    ctx.beginPath();
    ctx.arc(bomb.from.x, bomb.from.y, bomb.radius, 0, Math.PI * 2);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
};
const wizardDrawTarget = (wizard) => {
    ctx.beginPath();
    ctx.arc(wizard.follower.to.x, wizard.follower.to.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
};
const wizardDrawPath = (wizard) => {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(wizard.follower.from.x, wizard.follower.from.y);
    ctx.lineTo(wizard.follower.to.x, wizard.follower.to.y);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
};
const fireBallDraw = (fireBall) => {
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
        }
        else {
            drawWizard(wizard, "blue");
        }
        wizardDrawTarget(wizard);
        wizardDrawPath(wizard);
    });
    game.fireBalls.forEach(fireBallDraw);
    game.bombs.forEach(drawBomb);
    requestAnimationFrame(draw);
};
draw();
//# sourceMappingURL=index.js.map