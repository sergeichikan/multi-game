"use strict";
const idInput = document.querySelector('input[id="idInput"]');
const joinButton = document.querySelector('button[id="joinButton"]');
const closeButton = document.querySelector('button[id="closeButton"]');
const addBotButton = document.querySelector('button[id="addBotButton"]');
const hpSpan = document.querySelector('span[id="hpSpan"]');
const canvas = document.querySelector('canvas[id="mainCanvas"]');
const ctx = canvas && canvas.getContext("2d");
if (!idInput || !joinButton || !closeButton || !hpSpan || !addBotButton || !canvas) {
    throw new Error("invalid elements");
}
canvas.width = 800;
canvas.height = 800;
// отключаем контекстное меню по нажатию на ПКМ
canvas.addEventListener("contextmenu", (e) => e.button === 2 && e.preventDefault());
// joinButton.addEventListener("")
//# sourceMappingURL=index.js.map