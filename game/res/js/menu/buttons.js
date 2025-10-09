import { Sprite } from "../sprite.js";
import { canvas, ctx, setContinueAnimation, setEndGame, setMenuActive } from "../helpers.js";
import { drawMainMenu, resetProgress, unlockAllDiamonds } from "./menus.js";
import { startOfflineGame } from "../main.js";
import {
    addKeyDownListener,
    createBtnOnClick,
    drawNicknameMenu,
    joinRoomBtnOnClick,
    nextPage,
    previousPage,
    submitNickname,
} from "./onlineMenu.js";
import { drawWelcomeMenu } from "./canvas.js";

//check collision for button in menu
function checkButtonCollision(pos, button) {
    return (
        pos.x > button.position.x &&
        pos.x < button.position.x + button.width &&
        pos.y < button.position.y + button.height &&
        pos.y > button.position.y
    );
}

const TEXT_GAP = {
    3: 70,
    4: 42,
    5: 40,
    6: 10,
    7: 30,
    8: 30,
    10: 20,
    11: 20,
    14: 20,
};

class MenuButton {
    constructor({
        position,
        width,
        height,
        yOffset,
        text,
        runCode,
        withoutBg = false,
        fontSize = 75,
    }) {
        this.position = position;

        this.width = width;
        this.height = height;
        this.yOffset = yOffset;
        this.text = text;
        this.fontSize = fontSize;
        this.runCode = runCode;
        this.originalValues = {
            position: {
                x: position.x,
                y: position.y,
            },
            width,
            height,
            text,
            fontSize,
        };

        this.outerColor = "#929292";
        this.borderColor = "black";
        this.mainColor = "#848484";
        if (withoutBg) {
            this.mainColor = "#5c4614";
            this.borderColor = "#5c4614";
            this.outerColor = "#5c4614";
        }

        this.pressed = false;

        this.textGap = TEXT_GAP[this.text.length];
    }
    draw() {
        ctx.fillStyle = this.borderColor;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.fillStyle = this.mainColor;
        ctx.fillRect(this.position.x + 2, this.position.y + 2, this.width - 4, this.height - 4);

        ctx.font = `${this.fontSize}px Cinzel`;
        ctx.lineWidth = 6;
        ctx.strokeStyle = "black";
        ctx.strokeText(this.text, this.position.x + this.textGap, this.position.y + this.fontSize);

        ctx.font = `${this.fontSize}px Cinzel`;
        ctx.fillStyle = "yellow";
        ctx.fillText(this.text, this.position.x + this.textGap, this.position.y + this.fontSize);
    }
    scaleDown() {
        ctx.fillStyle = this.outerColor;
        ctx.fillRect(this.position.x - 1, this.position.y - 1, this.width + 2, this.height + 2);
        this.position.x += 1;
        this.position.y += 1;
        this.width -= 2;
        this.height -= 2;
        this.fontSize -= 1;
    }
    resetSize() {
        // this.position = this.originalValues.position tohle nefachá
        this.position.x = this.originalValues.position.x;
        this.position.y = this.originalValues.position.y;
        this.width = this.originalValues.width;
        this.height = this.originalValues.height;
        this.fontSize = this.originalValues.fontSize;
    }
    run() {
        this.runCode();
    }
    updatePositionY(pos) {
        this.position.y = pos + this.yOffset;
    }
}

const pauseButton = new Sprite({
    position: {
        x: canvas.width - 3 * 36,
        y: 0,
    },
    imgSrc: "./res/img/pause_img.png",
});

const unlockAllDiamondsButton = new MenuButton({
    position: {
        x: canvas.width - 520,
        y: canvas.height * 0.88,
    },
    width: 500,
    height: canvas.height * 0.1,
    yOffset: canvas.height * 0.43,
    text: "Unlock all",
    withoutBg: true,
    runCode: () => {
        unlockAllDiamonds();
        delete menuButtons.mainMenu.unlock;
        drawMainMenu();
    },
});

let menuButtons = {
    lost: {
        menu: new MenuButton({
            position: {
                x: canvas.width * 0.1 + (canvas.width * 0.8 - 2 * 300 - 125) / 2,
                y: canvas.height * 0.6,
            },
            width: 300,
            height: canvas.height * 0.1,
            yOffset: canvas.height * 0.4,
            text: "menu",
            runCode: () => {
                setMenuActive("mainMenu");
                drawMainMenu();
            },
        }),

        retry: new MenuButton({
            position: {
                x: canvas.width * 0.1 + (canvas.width * 0.8 - 2 * 300 - 125) / 2 + 425,
                y: canvas.height * 0.6,
            },
            width: 300,
            height: canvas.height * 0.1,
            yOffset: canvas.height * 0.4,
            text: "retry",
            runCode: () => {
                setEndGame(true);
            },
        }),
    },

    paused: {
        end: new MenuButton({
            position: {
                x: canvas.width * 0.1 + (canvas.width * 0.8 - 2 * 300 - 125) / 2,
                y: canvas.height * 0.5,
            },
            width: 300,
            height: canvas.height * 0.1,
            yOffset: canvas.height * 0.3,
            text: "end",
            runCode: () => {
                setMenuActive("mainMenu");
                drawMainMenu();
            },
        }),

        retry: new MenuButton({
            position: {
                x: canvas.width * 0.1 + (canvas.width * 0.8 - 2 * 300 - 125) / 2 + 425,
                y: canvas.height * 0.5,
            },
            width: 300,
            height: canvas.height * 0.1,
            yOffset: canvas.height * 0.3,
            text: "retry",
            runCode: () => {
                setEndGame(true);
            },
        }),

        resume: new MenuButton({
            position: {
                x: canvas.width * 0.4,
                y: canvas.height * 0.65,
            },
            width: 300,
            height: canvas.height * 0.1,
            yOffset: canvas.height * 0.45,
            text: "resume",
            runCode: () => {
                setContinueAnimation(true);
            },
        }),
    },

    won: {
        continue: new MenuButton({
            position: {
                x: canvas.width * 0.2 + 450 / 2,
                y: canvas.height * 0.63,
            },
            width: 450,
            height: canvas.height * 0.1,
            yOffset: canvas.height * 0.43,
            text: "continue",
            runCode: () => {
                setMenuActive("mainMenu");
                drawMainMenu();
            },
        }),
    },
    mainMenu: {
        unlock: unlockAllDiamondsButton,
        reset: new MenuButton({
            position: {
                x: canvas.width - 430,
                y: canvas.height * 0.78,
            },
            width: 430,
            height: canvas.height * 0.065,
            yOffset: canvas.height * 0.43,
            text: "Reset Progress",
            withoutBg: true,
            fontSize: 50,
            runCode: () => {
                resetProgress();
            },
        }),
    },
    menuBackground: {
        author: new MenuButton({
            position: {
                x: canvas.width * 0.06,
                y: canvas.height * 0.93,
            },
            width: 340,
            height: canvas.height * 0.06,
            yOffset: canvas.height * 0.43,
            text: "Pavel Skála",
            withoutBg: true,
            fontSize: 50,
            runCode: () => {
                window.open("https://github.com/pavel-skala", "_blank");
            },
        }),
    },
    welcomeMenu: {
        // offline: new MenuButton({
        //     position: {
        //         x: canvas.width * 0.1 + (canvas.width * 0.8 - 2 * 300 - 125) / 2,
        //         y: canvas.height * 0.5,
        //     },
        //     width: 300,
        //     height: canvas.height * 0.1,
        //     yOffset: canvas.height * 0.3,
        //     withoutBg: true,
        //     text: "offline",
        //     runCode: () => {
        //         setMenuActive("mainMenu");
        //         startOfflineGame();
        //     },
        // }),
        online: new MenuButton({
            position: {
                // x: canvas.width * 0.1 + (canvas.width * 0.8 - 2 * 300 - 125) / 2 + 425,
                x: canvas.width * 0.1 + (canvas.width * 0.5 - 2 * 300 - 125) / 2 + 425,
                y: canvas.height * 0.5,
            },
            width: 300,
            height: canvas.height * 0.1,
            yOffset: canvas.height * 0.3,
            withoutBg: true,
            text: "online",
            runCode: () => {
                setMenuActive("nicknameMenu");
                addKeyDownListener();
                drawNicknameMenu();
            },
        }),
    },
    nicknameMenu: {
        submit: new MenuButton({
            position: {
                x: canvas.width * 0.4,
                y: canvas.height * 0.45,
            },
            width: 300,
            height: canvas.height * 0.1,
            yOffset: canvas.height * 0.3,
            withoutBg: true,
            text: "submit",
            runCode: () => {
                submitNickname();
            },
        }),
    },
    roomsMenu: {
        create: new MenuButton({
            position: {
                x: canvas.width * 0.1 + (canvas.width * 0.8 - 2 * 300 - 125) / 2,
                y: canvas.height * 0.7,
            },
            width: 300,
            height: canvas.height * 0.1,
            yOffset: canvas.height * 0.3,
            withoutBg: true,
            text: "create",
            runCode: () => {
                console.log("create");
                createBtnOnClick();
            },
        }),
        join: new MenuButton({
            position: {
                x: canvas.width * 0.1 + (canvas.width * 0.8 - 2 * 300 - 125) / 2 + 425,
                y: canvas.height * 0.7,
            },
            width: 300,
            height: canvas.height * 0.1,
            yOffset: canvas.height * 0.3,
            withoutBg: true,
            text: "join",
            runCode: () => {
                joinRoomBtnOnClick();
            },
        }),
        previousPage: new MenuButton({
            position: {
                x: 200,
                y: canvas.height * 0.6,
            },
            width: 200,
            height: canvas.height * 0.045,
            yOffset: canvas.height * 0.3,
            withoutBg: true,
            fontSize: 30,
            text: "previous",
            runCode: () => {
                previousPage();
            },
        }),
        nextPage: new MenuButton({
            position: {
                x: 1050,
                y: canvas.height * 0.6,
            },
            width: 150,
            height: canvas.height * 0.045,
            yOffset: canvas.height * 0.3,
            withoutBg: true,
            fontSize: 30,
            text: "Next",
            runCode: () => {
                nextPage();
            },
        }),
        back: new MenuButton({
            position: {
                x: 0,
                y: 30,
            },
            width: 200,
            height: 100,
            yOffset: 0,
            withoutBg: true,
            fontSize: 35,
            text: "Back",
            runCode: () => {
                setMenuActive("welcomeMenu");
                drawWelcomeMenu();
            },
        }),
    },
};

export { pauseButton, menuButtons, checkButtonCollision, unlockAllDiamondsButton };
