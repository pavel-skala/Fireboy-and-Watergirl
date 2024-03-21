import { Sprite } from "./sprite.js";
import { menuButtons } from "./buttons.js";
import { canvas, ctx } from "./helpers.js";
import { quests } from "./game.js";

const menuBg = new Sprite({
    position: {
        x: canvas.width * 0.1,
        y: canvas.height * 0.2,
    },
    imgSrc: "./res/img/menu_bg.png",
});

const menusTexts = {
    lost: () => {
        ctx.font = "120px Cinzel";
        ctx.lineWidth = 7;
        ctx.strokeStyle = "black";
        ctx.strokeText("Game Over", canvas.width * 0.25, menuBg.position.y + canvas.height * 0.25);

        ctx.fillStyle = "yellow";
        ctx.fillText("Game Over", canvas.width * 0.25, menuBg.position.y + canvas.height * 0.25);
    },
    paused: () => {
        ctx.font = "120px Cinzel";
        ctx.lineWidth = 7;
        ctx.strokeStyle = "black";
        ctx.strokeText("Paused", canvas.width * 0.35, menuBg.position.y + canvas.height * 0.25);

        ctx.fillStyle = "yellow";
        ctx.fillText("Paused", canvas.width * 0.35, menuBg.position.y + canvas.height * 0.25);
    },
    won: () => {
        quests.forEach((quest) => {
            quest.updatePositionY(menuBg.position.y);
            quest.draw();
        });
    },
};

function drawInGameMenu(name, transform) {
    menuBg.position.y += transform;
    menuBg.draw();
    
    menusTexts[name]();

    for (const btnName in menuButtons[name]) {
        menuButtons[name][btnName].updatePositionY(menuBg.position.y);
        menuButtons[name][btnName].draw();
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

export { drawMenu, drawInGameMenu };
