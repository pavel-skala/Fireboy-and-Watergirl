import { Sprite } from "./sprite.js";
import { menuButtons } from "./buttons.js";
import { canvas, ctx, currentLevel } from "./helpers.js";
import { quests } from "./game.js";
import { levelTime } from "./time.js";
import { drawArrow } from "./quests.js";
import { MenuDiamond } from "./menuDiamond.js";

const menuBg = new Sprite({
    position: {
        x: canvas.width * 0.1,
        y: canvas.height * 0.2,
    },
    imgSrc: "./res/img/menu_bg.png",
});

const menuDiamondsBorderColor = {
    true: "#fac702",
    false: "#4d3b0e",
};

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
        const fullText = "Time : " + levelTime.minutes + ":" + levelTime.seconds;
        //time
        ctx.font = "50px Cinzel";
        ctx.lineWidth = 7;
        ctx.strokeStyle = "black";
        ctx.strokeText(fullText, 600, menuBg.position.y + 160);

        ctx.fillStyle = "yellow";
        ctx.fillText(fullText, 600, menuBg.position.y + 160);

        quests.forEach((quest) => {
            quest.updatePositionY(menuBg.position.y);
            quest.draw();
        });

        drawArrow(menuBg.position.y);

        menuWonDiamond.position.y = menuBg.position.y + 280;
        menuWonDiamond.setQuestsStatus(menuDiamonds[currentLevel].questsStatus);
        menuWonDiamond.drawFullDiamond();
    },
};

let menuWonDiamond = new MenuDiamond({
    position: {
        x: 900,
        y: 270,
    },
    unlocked: true,
});

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
    ctx.fillStyle = "#5c4614";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const key in menuDiamonds) {
        const diamond = menuDiamonds[key];

        diamond.drawFullDiamond();
    }
}

function checkMenuDiamondsCollision(pos, diamond) {
    return (
        diamond.unlocked &&
        pos.x > diamond.position.x &&
        pos.x < diamond.position.x + diamond.height * 0.9 &&
        pos.y < diamond.position.y + diamond.height &&
        pos.y > diamond.position.y
    );
}

let menuDiamonds = {
    1: new MenuDiamond({
        position: {
            x: canvas.width * 0.48,
            y: canvas.height * 0.9,
        },
        questsStatus: 0,
        unlocked: true,
        pathUnlocking: [],
        diamondsUnlocking: [],
    }),
};

export {
    drawMenu,
    drawInGameMenu,
    checkMenuDiamondsCollision,
    menuDiamonds,
    menuDiamondsBorderColor,
};
