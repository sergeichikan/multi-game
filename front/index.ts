const idInput = document.querySelector<HTMLInputElement>('input[id="idInput"]');
const joinButton = document.querySelector<HTMLButtonElement>('button[id="joinButton"]');
const closeButton = document.querySelector<HTMLButtonElement>('button[id="closeButton"]');
const addBotButton = document.querySelector<HTMLButtonElement>('button[id="addBotButton"]');
const hpSpan = document.querySelector<HTMLSpanElement>('span[id="hpSpan"]');
const canvas = document.querySelector<HTMLCanvasElement>('canvas[id="mainCanvas"]');
const ctx = canvas && canvas.getContext("2d");

if (!idInput || !joinButton || !closeButton || !hpSpan || !addBotButton || !canvas) {
    throw new Error("invalid elements");
}

canvas.width = 800;
canvas.height = 800;
canvas.style.background = "#eeeeee";

// отключаем контекстное меню по нажатию на ПКМ
canvas.addEventListener("contextmenu", (e) => e.button === 2 && e.preventDefault());

const eventSource = new EventSource("/sse");

eventSource.addEventListener("open", () => {
    console.log("[open]");
});
eventSource.addEventListener("message", ({ data }: MessageEvent) => {
    console.log("[message]", data);
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
