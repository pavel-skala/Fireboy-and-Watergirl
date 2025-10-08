import { Sprite } from "../sprite.js";

export class Door extends Sprite {
    constructor({ position, element }) {
        const imgSrc = "./res/img/door_sprite.png";
        const imgRows = 2;

        let currentRow = 1;
        if (element == "water") {
            currentRow = 2;
        }

        const frameRate = 13;
        const frameDelay = 2;

        super({ position, imgSrc, currentRow, imgRows, frameRate, frameDelay });

        this.position = position;
        this.element = element;

        this.pressed = false;

        this.hitbox = {
            position: {
                x: this.position.x + 20,
                y: this.position.y + 20,
            },
            height: 88,
            width: 60,
        };

        this.maxFrame = frameRate - 1;

        this.opened = false;
    }
    openDoor() {
        //closing door
        if (!this.pressed && this.currentFrame != 0) {
            this.currentFrame--;
        }

        //opening door
        if (this.pressed && this.currentFrame != this.maxFrame) {
            this.currentFrame++;
        }

        if (this.currentFrame == this.maxFrame) {
            this.opened = true;
            return;
        }
        this.opened = false;
    }
}
