import { Sprite } from "../sprite.js";

export class Diamond extends Sprite {
    constructor({ position, type }) {
        let currentRow = 1;
        if (type == "fire") {
            currentRow = 2;
        }

        const imgSrc = "./res/img/diamonds.png";
        const imgRows = 2;

        super({ position, imgSrc, currentRow, imgRows });
        this.position = position;
        this.type = type;

        this.hitbox = {
            position: this.position,
            width: 44,
            height: 36,
        };
    }
}
