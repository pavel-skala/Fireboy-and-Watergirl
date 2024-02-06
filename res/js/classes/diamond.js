import { Sprite } from "../sprite.js";

export class Diamond extends Sprite {
    constructor({ position, element }) {
        let currentRow = 1;
        if (element == "fire") {
            currentRow = 2;
        }

        const imgSrc = "./res/img/diamonds.png";
        const imgRows = 2;

        super({ position, imgSrc, currentRow, imgRows });
        this.element = element;
    }
}