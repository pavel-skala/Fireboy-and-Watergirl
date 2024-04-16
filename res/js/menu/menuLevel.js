import { ctx } from "../helpers.js";
import { menuDiamondsBorderColor } from "./menus.js";
import { Sprite } from "../sprite.js";

export class MenuLevel extends Sprite {
    constructor({ position, questsStatus, unlocked, pathUnlocking, levelsUnlocking, quests }) {
        const imgSrc = "./res/img/menuDiamonds.png";
        const imgRows = 3;

        super({ position, imgSrc, imgRows });

        this.position = position;
        this.height = 80;
        this.width = this.height * 0.9;
        this.offset;

        this.questsStatus = questsStatus;
        this.unlocked = unlocked;
        this.pathUnlocking = pathUnlocking;
        this.levelsUnlocking = levelsUnlocking;

        this.borderColor;

        this.quests = quests;
    }
    setQuestsStatus(num) {
        this.questsStatus = num;

        this.currentRow = num + 1;
    }
    drawFullDiamond() {
        this.borderColor = menuDiamondsBorderColor[this.unlocked];

        this.offset = 12;
        this.drawHexagon(
            this.position.x - this.offset,
            this.position.y - this.offset,
            this.height + this.offset * 2,
            this.width + this.offset * 2,
            "black"
        );

        this.offset = 9;
        this.drawHexagon(
            this.position.x - this.offset,
            this.position.y - this.offset,
            this.height + this.offset * 2,
            this.width + this.offset * 2,
            this.borderColor
        );

        this.offset = 1;
        this.drawHexagon(
            this.position.x - this.offset,
            this.position.y - this.offset,
            this.height + this.offset * 2,
            this.width + this.offset * 2,
            "black"
        );
        this.draw();
    }
    drawHexagon(posX, posY, height, width, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(posX + width / 2, posY);
        ctx.lineTo(posX + width, posY + height / 4);
        ctx.lineTo(posX + width, posY + (height / 4) * 3);
        ctx.lineTo(posX + width / 2, posY + height);
        ctx.lineTo(posX, posY + (height / 4) * 3);
        ctx.lineTo(posX, posY + height / 4);
        ctx.lineTo(posX + width / 2, posY);
        ctx.fill();
    }
}
