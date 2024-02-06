import { Sprite } from "./sprite.js";
import { menuButtons } from "./buttons.js";
import { canvas, ctx } from "./helpers.js";

const menuBg = new Sprite({
    position: {
        x: canvas.width * 0.1,
        y: canvas.height * 0.2,
    },
    imgSrc: "./res/img/menu_bg.png",
});

function drawMenuLost(transform) {
    menuBg.position.y += transform;
    menuBg.draw();

    ctx.font = "120px Cinzel";
    ctx.lineWidth = 7;
    ctx.strokeStyle = "black";
    ctx.strokeText("Game Over", canvas.width * 0.25, menuBg.position.y + canvas.height * 0.25);

    ctx.font = "120px Cinzel";
    ctx.fillStyle = "yellow";
    ctx.fillText("Game Over", canvas.width * 0.25, menuBg.position.y + canvas.height * 0.25);

    for (const name in menuButtons["lost"]) {
        menuButtons["lost"][name].updatePositionY(menuBg.position.y);
        menuButtons["lost"][name].draw();
    }

    menuBg.position.y -= transform;
}

function drawMenuPause(transform) {
    menuBg.position.y += transform;
    menuBg.draw();

    ctx.font = "120px Cinzel";
    ctx.lineWidth = 7;
    ctx.strokeStyle = "black";
    ctx.strokeText("Paused", canvas.width * 0.35, menuBg.position.y + canvas.height * 0.25);

    ctx.font = "120px Cinzel";
    ctx.fillStyle = "yellow";
    ctx.fillText("Paused", canvas.width * 0.35, menuBg.position.y + canvas.height * 0.25);

    for (const name in menuButtons["paused"]) {
        menuButtons["paused"][name].updatePositionY(menuBg.position.y);
        menuButtons["paused"][name].draw();
    }

    menuBg.position.y -= transform;
}

function drawMenu() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "150px Cinzel";
    ctx.fillStyle = "yellow";
    ctx.fillText("Menu soon", canvas.width * 0.2, 200);
}

export { drawMenuLost, drawMenuPause, drawMenu };
