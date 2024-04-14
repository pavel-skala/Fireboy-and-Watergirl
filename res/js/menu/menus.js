import { Sprite } from "../sprite.js";
import { menuButtons } from "./buttons.js";
import { canvas, ctx, currentLevel } from "../helpers.js";
import { quests } from "../game.js";
import { levelTime } from "../time.js";
import { drawArrow } from "./quests.js";
import { MenuLevel } from "./menuLevel.js";

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

        menuLevels[currentLevel].quests.forEach((quest) => {
            quest.updatePositionY(menuBg.position.y);
            quest.draw();
        });

        drawArrow(menuBg.position.y);

        menuWonDiamond.position.y = menuBg.position.y + 280;
        menuWonDiamond.setQuestsStatus(menuLevels[currentLevel].questsStatus);
        menuWonDiamond.drawFullDiamond();
    },
};

let menuWonDiamond = new MenuLevel({
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

    let fullText = "Fireboy";
    ctx.font = "70px Cinzel";
    ctx.lineWidth = 7;
    ctx.strokeStyle = "black";
    ctx.strokeText(fullText, canvas.width * 0.23, canvas.height * 0.1);

    ctx.fillStyle = "red";
    ctx.fillText(fullText, canvas.width * 0.23, canvas.height * 0.1);

    fullText = "and";
    ctx.font = "70px Cinzel";
    ctx.lineWidth = 7;
    ctx.strokeStyle = "black";
    ctx.strokeText(fullText, canvas.width * 0.44, canvas.height * 0.1);

    ctx.fillStyle = "yellow";
    ctx.fillText(fullText, canvas.width * 0.44, canvas.height * 0.1);

    fullText = "Watergirl";
    ctx.font = "70px Cinzel";
    ctx.lineWidth = 7;
    ctx.strokeStyle = "black";
    ctx.strokeText(fullText, canvas.width * 0.56, canvas.height * 0.1);

    ctx.fillStyle = "#2596be";
    ctx.fillText(fullText, canvas.width * 0.56, canvas.height * 0.1);

    fullText = "Created by:";
    ctx.font = "50px Cinzel";
    ctx.lineWidth = 7;
    ctx.strokeStyle = "black";
    ctx.strokeText(fullText, canvas.width * 0.01, canvas.height * 0.92);

    ctx.fillStyle = "yellow";
    ctx.fillText(fullText, canvas.width * 0.01, canvas.height * 0.92);

    //buttons
    for (const btnName in menuButtons.mainMenu) {
        menuButtons.mainMenu[btnName].draw();
    }

    //paths
    for (const key in menuLevelsPath) {
        const path = menuLevelsPath[key];
        drawFullPath(path);
    }

    //diamonds
    for (const key in menuLevels) {
        const diamond = menuLevels[key];

        diamond.drawFullDiamond();
    }
}

function drawFullPath(path) {
    const mainColor = menuDiamondsBorderColor[path.unlocked];
    drawPathPart(path, 0, 3, "black");
    drawPathPart(path, 3, 9, mainColor);
    drawPathPart(path, 12, 3, "black");
}

function drawPathPart(path, offset, width, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(path.position.x + offset, path.position.y);
    ctx.lineTo(path.finalPosition.x + offset, path.finalPosition.y);
    ctx.lineTo(path.finalPosition.x + width + offset, path.finalPosition.y);
    ctx.lineTo(path.position.x + width + offset, path.position.y);
    ctx.lineTo(path.position.x + offset, path.position.y);
    ctx.fill();
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

function unlockAllDiamonds() {
    for (const index in menuLevels) {
        menuLevels[index].unlocked = true;
    }
    for (const index in menuLevelsPath) {
        menuLevelsPath[index].unlocked = true;
    }
    drawMenu();
}

let menuLevels = {
    1: new MenuLevel({
        position: {
            x: canvas.width * 0.48,
            y: canvas.height * 0.9,
        },
        questsStatus: 0,
        unlocked: true,
        pathUnlocking: [1],
        levelsUnlocking: [2],
        quests: [quests.levelCompleted, quests.allDiamonds],
    }),
    2: new MenuLevel({
        position: {
            x: canvas.width * 0.48,
            y: canvas.height * 0.75,
        },
        questsStatus: 0,
        unlocked: false,
        pathUnlocking: [2],
        levelsUnlocking: [3],
        quests: [quests.levelCompleted, quests.allDiamonds],
    }),
    3: new MenuLevel({
        position: {
            x: canvas.width * 0.48,
            y: canvas.height * 0.6,
        },
        questsStatus: 0,
        unlocked: false,
        pathUnlocking: [3],
        levelsUnlocking: [4],
        quests: [quests.levelCompleted, quests.allDiamonds],
    }),
    4: new MenuLevel({
        position: {
            x: canvas.width * 0.48,
            y: canvas.height * 0.45,
        },
        questsStatus: 0,
        unlocked: false,
        pathUnlocking: [4],
        levelsUnlocking: [5],
        quests: [quests.levelCompleted, quests.allDiamonds],
    }),
    5: new MenuLevel({
        position: {
            x: canvas.width * 0.48,
            y: canvas.height * 0.3,
        },
        questsStatus: 0,
        unlocked: false,
        pathUnlocking: [],
        levelsUnlocking: [],
        quests: [quests.levelCompleted, quests.allDiamonds],
    }),
};

let menuLevelsPath = {
    1: {
        position: {
            x: 691,
            y: canvas.height * 0.9,
        },
        finalPosition: {
            x: 691,
            y: canvas.height * 0.81,
        },
        unlocked: false,
    },
    2: {
        position: {
            x: 691,
            y: canvas.height * 0.75,
        },
        finalPosition: {
            x: 691,
            y: canvas.height * 0.66,
        },
        unlocked: false,
    },
    3: {
        position: {
            x: 691,
            y: canvas.height * 0.6,
        },
        finalPosition: {
            x: 691,
            y: canvas.height * 0.51,
        },
        unlocked: false,
    },
    4: {
        position: {
            x: 691,
            y: canvas.height * 0.45,
        },
        finalPosition: {
            x: 691,
            y: canvas.height * 0.36,
        },
        unlocked: false,
    },
};

export {
    drawMenu,
    drawInGameMenu,
    checkMenuDiamondsCollision,
    unlockAllDiamonds,
    menuLevels,
    menuLevelsPath,
    menuDiamondsBorderColor,
};
