export const initCanvas = () => {
    const canvas = document.querySelector<HTMLCanvasElement>('canvas[id="mainCanvas"]');
    const ctx = canvas && canvas.getContext("2d");

    if (!canvas || !ctx) {
        throw new Error("invalid elements");
    }

    canvas.width = 800;
    canvas.height = 800;
    canvas.style.background = "#eeeeee";

    // отключаем контекстное меню по нажатию на ПКМ
    canvas.addEventListener("contextmenu", (e) => e.button === 2 && e.preventDefault());

    return {
        canvas,
        ctx,
    };
};
