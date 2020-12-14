import { Point } from "../libs/point.js";
const idInput = document.querySelector('input[id="idInput"]');
const joinButton = document.querySelector('button[id="joinButton"]');
const closeButton = document.querySelector('button[id="closeButton"]');
const addBotButton = document.querySelector('button[id="addBotButton"]');
const hpSpan = document.querySelector('span[id="hpSpan"]');
const canvas = document.querySelector('canvas[id="mainCanvas"]');
const ctx = canvas && canvas.getContext("2d");
if (!idInput || !joinButton || !closeButton || !hpSpan || !addBotButton || !canvas || !ctx) {
    throw new Error("invalid elements");
}
canvas.width = 800;
canvas.height = 800;
canvas.style.background = "#eeeeee";
// отключаем контекстное меню по нажатию на ПКМ
canvas.addEventListener("contextmenu", (e) => e.button === 2 && e.preventDefault());
let game = {
    wizards: [],
};
const eventSource = new EventSource("/sse");
eventSource.addEventListener("open", () => {
    console.log("[open]");
});
eventSource.addEventListener("message", ({ data }) => {
    game = JSON.parse(data);
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
    return fetch("/target", {
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
const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.wizards.forEach((wizard) => {
        if (idInput.value === wizard.id) {
            drawWizard(wizard, "green");
        }
        else {
            drawWizard(wizard, "red");
        }
        wizardDrawTarget(wizard);
        wizardDrawPath(wizard);
    });
    requestAnimationFrame(draw);
};
draw();
//# sourceMappingURL=index.js.map