import { Sprite } from "../sprite.js";
import { canvas, ctx, setContinueAnimation, setEndGame, setMenuActive } from "../helpers.js";
import { drawMenu, unlockAllDiamonds } from "./menus.js";

//check collision for button in menu
function checkButtonCollision(pos, button) {
    return (
        pos.x > button.position.x &&
        pos.x < button.position.x + button.width &&
        pos.y < button.position.y + button.height &&
        pos.y > button.position.y
    );
}

class MenuButton {
    constructor({
        position,
        width,
        height,
        yOffset,
        text,
        runCode,
        outerColor = "#929292",
        borderColor = "black",
        mainColor = "#848484",
    }) {
        this.position = position;

        this.width = width;
        this.height = height;
        this.yOffset = yOffset;
        this.text = text;
        this.fontSize = 75;
        this.runCode = runCode;
        this.originalValues = {
            position: {
                x: position.x,
                y: position.y,
            },
            width,
            height,
            text,
            fontSize: 75,
        };

        this.outerColor = outerColor;
        this.borderColor = borderColor;
        this.mainColor = mainColor;

        this.pressed = false;

        this.textGap;
        switch (this.text.length) {
            case 3:
                this.textGap = 70;
                break;
            case 4:
                this.textGap = 42;
                break;
            case 5:
                this.textGap = 40;
                break;
            case 6:
                this.textGap = 10;
                break;
            case 7:
                this.textGap = 30;
                break;
            case 8:
                this.textGap = 30;
                break;
            case 10:
                this.textGap = 20;
                break;
        }
    }
    draw() {
        ctx.fillStyle = this.borderColor;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.fillStyle = this.mainColor;
        ctx.fillRect(this.position.x + 2, this.position.y + 2, this.width - 4, this.height - 4);

        ctx.font = `${this.fontSize}px Cinzel`;
        ctx.lineWidth = 7;
        ctx.strokeStyle = "black";
        ctx.strokeText(this.text, this.position.x + this.textGap, this.position.y + 80);

        ctx.font = `${this.fontSize}px Cinzel`;
        ctx.fillStyle = "yellow";
        ctx.fillText(this.text, this.position.x + this.textGap, this.position.y + 80);
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

const menuButtons = {
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
                drawMenu();
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
                drawMenu();
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
                drawMenu();
            },
        }),
    },
    mainMenu: {
        unlock: new MenuButton({
            position: {
                x: canvas.width - 520,
                y: canvas.height * 0.88,
            },
            width: 500,
            height: canvas.height * 0.1,
            yOffset: canvas.height * 0.43,
            text: "Unlock all",
            mainColor: "#5c4614",
            borderColor: "#5c4614",
            outerColor: "#5c4614",
            runCode: () => {
                unlockAllDiamonds();
                delete menuButtons.mainMenu.unlock;
                drawMenu();
            },
        }),
    },
};

export { pauseButton, menuButtons, checkButtonCollision };
