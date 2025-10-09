import { Sprite } from "../sprite.js";
import { menuButtons, unlockAllDiamondsButton } from "./buttons.js";
import {
    canvas,
    ctx,
    currentLevel,
    menuLevels,
    menuLevelsPath,
    setMenuLevels,
    setMenuLevelsPath,
} from "../helpers.js";
import { quests } from "./quests.js";
import { MenuLevel } from "./menuLevel.js";
import { levelTime } from "../time.js";
import { drawArrow, drawMenuBackground, drawText } from "./canvas.js";

let menuBg = new Sprite({
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
        drawText(
            "Game Over",
            canvas.width * 0.25,
            menuBg.position.y + canvas.height * 0.25,
            120,
            "yellow"
        );
    },
    paused: () => {
        drawText(
            "Paused",
            canvas.width * 0.35,
            menuBg.position.y + canvas.height * 0.25,
            120,
            "yellow"
        );
    },
    won: () => {
        //time
        const fullText = `Time : ${levelTime.minutes}:${levelTime.seconds}`;
        drawText(fullText, 600, menuBg.position.y + 160, 50, "yellow");

        menuLevels[currentLevel].quests.forEach((quest) => {
            quest.updatePositionY(menuBg.position.y);
            quest.draw();
        });
        drawArrow(700, menuBg.position.y + 310, "#fac702");

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

function drawMainMenu() {
    drawMenuBackground();

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
    drawMainMenu();
}

function resetProgress() {
    localStorage.clear();

    for (const index in menuLevels) {
        menuLevels[index].setQuestsStatus(0);
        if (index == 1) {
            menuLevels[index].unlocked = true;
            continue;
        }
        menuLevels[index].unlocked = false;
    }

    for (const index in menuLevelsPath) {
        menuLevelsPath[index].unlocked = false;
    }

    menuButtons.mainMenu.unlock = unlockAllDiamondsButton;

    drawMainMenu();
}

let menuLevelX = canvas.width * 0.48;

setMenuLevels({
    1: new MenuLevel({
        position: {
            x: menuLevelX,
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
            x: menuLevelX,
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
            x: menuLevelX,
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
            x: menuLevelX,
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
            x: menuLevelX,
            y: canvas.height * 0.3,
        },
        questsStatus: 0,
        unlocked: false,
        pathUnlocking: [5],
        levelsUnlocking: [6],
        quests: [quests.levelCompleted, quests.allDiamonds],
    }),
    6: new MenuLevel({
        position: {
            x: menuLevelX,
            y: canvas.height * 0.15,
        },
        questsStatus: 0,
        unlocked: false,
        pathUnlocking: [],
        levelsUnlocking: [],
        quests: [quests.finalDiamond],
    }),
});

let menuLevelPathX = 691;

setMenuLevelsPath({
    1: {
        position: {
            x: menuLevelPathX,
            y: canvas.height * 0.9,
        },
        finalPosition: {
            x: menuLevelPathX,
            y: canvas.height * 0.81,
        },
        unlocked: false,
    },
    2: {
        position: {
            x: menuLevelPathX,
            y: canvas.height * 0.75,
        },
        finalPosition: {
            x: menuLevelPathX,
            y: canvas.height * 0.66,
        },
        unlocked: false,
    },
    3: {
        position: {
            x: menuLevelPathX,
            y: canvas.height * 0.6,
        },
        finalPosition: {
            x: menuLevelPathX,
            y: canvas.height * 0.51,
        },
        unlocked: false,
    },
    4: {
        position: {
            x: menuLevelPathX,
            y: canvas.height * 0.45,
        },
        finalPosition: {
            x: menuLevelPathX,
            y: canvas.height * 0.36,
        },
        unlocked: false,
    },
    5: {
        position: {
            x: menuLevelPathX,
            y: canvas.height * 0.3,
        },
        finalPosition: {
            x: menuLevelPathX,
            y: canvas.height * 0.21,
        },
        unlocked: false,
    },
});

export {
    drawMainMenu,
    drawInGameMenu,
    checkMenuDiamondsCollision,
    unlockAllDiamonds,
    menuDiamondsBorderColor,
    resetProgress,
};
