import { Sprite } from "../sprite.js";
import { ctx } from "../helpers.js";

export class Ramp {
    constructor({ position, color, finalPosition, finalColor, boxCount }) {
        this.position = position;
        this.color = color;
        this.startPosition = { ...position };

        this.finalPosition = finalPosition;
        this.finalColor = finalColor;

        this.hitbox = {
            position: {
                x: this.position.x,
                y: this.position.y + 5,
            },
            width: 36 * boxCount,
            height: 26,
        };
        this.shape = "ramp";
        this.blocked = false;
        this.blockedDirection;

        this.value = 1;

        this.direction = "x";
        if (this.startPosition.x == this.finalPosition.x) {
            this.direction = "y";
            if (this.startPosition.y > this.finalPosition.y) {
                this.value = -1;
            }
        } else {
            if (this.startPosition.x > this.finalPosition.x) {
                this.value = -1;
            }
        }

        this.boxCount = boxCount;
        this.moving = false;

        this.ramps = [];

        for (let i = 0; i < boxCount; i++) {
            let currentRow = 2;
            let flipImage = false;
            if (i == 0) {
                currentRow = 1;
            } else if (i == boxCount - 1) {
                currentRow = 1;
                flipImage = true;
            }
            this.ramps.push(
                new Sprite({
                    position: {
                        x: this.position.x + 36 * i,
                        y: this.position.y,
                    },
                    imgSrc: "./res/img/ramp.png",
                    flipImage: flipImage,
                    imgRows: 2,
                    currentRow: currentRow,
                })
            );
        }
    }
    draw(pressed) {
        if (pressed) ctx.fillStyle = this.finalColor;
        else ctx.fillStyle = this.color;

        ctx.fillRect(this.position.x + 6, this.position.y + 10, 36 * this.boxCount - 12, 16);
        this.ramps.forEach((ramp) => {
            ramp.draw();
        });
    }
    addValue(value) {
        this.moving = true;
        this.position[this.direction] += value;
        this.hitbox.position[this.direction] += value;
        this.ramps.forEach((ramp) => {
            ramp.position[this.direction] += value;
        });
    }
    move(pressed) {
        this.moving = false;

        if (pressed) {
            if (this.blocked && this.blockedDirection == "down") {
                this.blockedDirection = null;
                this.blocked = false;
                return;
            }
            if (this.position[this.direction] != this.finalPosition[this.direction]) {
                this.addValue(this.value);
            }
            return;
        }

        if (this.blocked && this.blockedDirection == "up") {
            this.blocked = false;
            this.blockedDirection = null;
            return;
        }

        if (this.position[this.direction] != this.startPosition[this.direction]) {
            this.addValue(this.value * -1);
        }
    }
}
