import {
    canClick,
    canvas,
    ctx,
    getMousePos,
    menuActive,
    menuButtonPressed,
    setMenuButtonPressed,
} from "../helpers.js";
import { checkButtonCollision, menuButtons } from "./buttons.js";
import { table } from "./onlineMenu.js";

function drawMenuBackground() {
    ctx.fillStyle = "#5c4614";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawText("Fireboy", canvas.width * 0.23, canvas.height * 0.1, 70, "red");

    drawText("and", canvas.width * 0.44, canvas.height * 0.1, 70, "yellow");

    drawText("Watergirl", canvas.width * 0.56, canvas.height * 0.1, 70, "#2596be");

    drawText("Created by:", canvas.width * 0.01, canvas.height * 0.92, 50, "yellow");

    menuButtons.menuBackground.author.draw();
}

function drawWelcomeMenu() {
    drawMenuBackground();

    for (const btnName in menuButtons.welcomeMenu) {
        menuButtons.welcomeMenu[btnName].draw();
    }
}

function drawText(text, x, y, fontSize, color) {
    ctx.font = `${fontSize}px Cinzel`;
    ctx.strokeStyle = "black";
    ctx.lineWidth = Math.round(fontSize / 10) + 1;
    ctx.strokeText(text, x, y);

    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
}

function drawArrow(x, y, color) {
    let startX = x;
    let startY = y;
    let size = 100;
    let arrowX = startX + 0.75 * size;
    let arrowTopY = startY - 0.707 * (0.25 * size);
    let arrowBottomY = startY + 0.707 * (0.25 * size);

    ctx.strokeStyle = color;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + size, startY);
    ctx.moveTo(startX + size + 1, startY + 3);
    ctx.lineTo(arrowX, arrowTopY);
    ctx.moveTo(startX + size + 1, startY - 3);
    ctx.lineTo(arrowX, arrowBottomY);
    ctx.stroke();
}

function drawImage(src, x, y) {
    let img = new Image();
    img.src = src;
    img.onload = () => {
        ctx.drawImage(img, x, y);
    };
}

function drawTableUnderline(yPos) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(table.position.x[0], yPos);
    ctx.lineTo(table.position.x[2] + 200, yPos);
    ctx.stroke();
}

// canvas.onmousedown
canvas.onmousedown = (event) => {
    if (!canClick) return;
    if (menuButtonPressed) return;

    const mousePos = getMousePos(event);

    for (const menuButton in menuButtons[menuActive]) {
        if (checkButtonCollision(mousePos, menuButtons[menuActive][menuButton])) {
            setMenuButtonPressed(menuButton);
            menuButtons[menuActive][menuButton].scaleDown();
            menuButtons[menuActive][menuButton].draw();
        }
    }

    if (checkButtonCollision(mousePos, menuButtons.menuBackground.author)) {
        setMenuButtonPressed("author");
        menuButtons.menuBackground.author.scaleDown();
        menuButtons.menuBackground.author.draw();
    }
};

canvas.onmouseup = (event) => {
    if (!canClick) return;
    const mousePos = getMousePos(event);

    if (checkButtonCollision(mousePos, menuButtons.menuBackground.author)) {
        menuButtons.menuBackground.author.resetSize();
        menuButtons.menuBackground.author.draw();

        setTimeout(() => {
            menuButtons.menuBackground.author.run();

            setMenuButtonPressed(null);
        }, 200);
        return;
    }

    for (const menuButton in menuButtons[menuActive]) {
        if (
            checkButtonCollision(mousePos, menuButtons[menuActive][menuButton]) &&
            menuButtonPressed == menuButton
        ) {
            menuButtons[menuActive][menuButton].resetSize();
            menuButtons[menuActive][menuButton].draw();

            setTimeout(() => {
                if (!menuActive) return;

                menuButtons[menuActive][menuButton].run();

                setMenuButtonPressed(null);
            }, 200);
            return;
        }
    }

    if (menuButtonPressed == "author") {
        menuButtons.menuBackground.author.resetSize();
        menuButtons.menuBackground.author.draw();
        setMenuButtonPressed(null);
    }

    if (menuButtonPressed) {
        menuButtons[menuActive][menuButtonPressed].resetSize();
        menuButtons[menuActive][menuButtonPressed].draw();
        setMenuButtonPressed(null);
    }
};

export { drawMenuBackground, drawWelcomeMenu, drawText, drawArrow, drawTableUnderline, drawImage };
