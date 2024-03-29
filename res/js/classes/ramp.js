import { Sprite } from "../sprite.js";
import { ctx } from "../helpers.js";

export class Ramp {
    constructor({ position, color, finalPosition, finalColor, boxCount, rotated }) {
        this.position = position;
        this.color = color;
        this.startPosition = { ...position };

        this.finalPosition = finalPosition;
        this.finalColor = finalColor;

        this.rotated = rotated;

        this.hitbox = {
            position: {
                x: this.position.x,
                y: this.position.y + 5,
            },
            width: 36 * boxCount,
            height: 26,
        };

        if (this.rotated) {
            this.hitbox.position.x += 5;
            this.hitbox.position.y -= 3;
            this.hitbox.width = 26;
            this.hitbox.height = 36 * boxCount;
        }

        this.shape = "ramp";
        this.blocked = false;
        this.blockedDirection;

        this.addingValue = 1;

        this.direction = "x";
        if (this.startPosition.x == this.finalPosition.x) {
            this.direction = "y";
            if (this.startPosition.y > this.finalPosition.y) {
                this.addingValue = -1;
            }
        } else {
            if (this.startPosition.x > this.finalPosition.x) {
                this.addingValue = -1;
            }
        }

        this.boxCount = boxCount;

        this.ramps = [];

        this.offset = {
            x: 0,
            y: 0,
        };
        this.angle = null;
        if (rotated) {
            this.offset.y = 36;
            this.angle = (90 * Math.PI) / 180;
        } else {
            this.offset.x = 36;
        }

        for (let i = 0; i < boxCount; i++) {
            let currentRow = 2;
            let flipImage = false;
            if (i == 0) {
                currentRow = 1;
            } else if (i == boxCount - 1) {
                currentRow = 1;
                flipImage = true;
                this.angle = -this.angle;
            }
            this.ramps.push(
                new Sprite({
                    position: {
                        x: this.position.x + this.offset.x * i,
                        y: this.position.y + this.offset.y * i,
                    },
                    imgSrc: "./res/img/ramp.png",
                    flipImage: flipImage,
                    imgRows: 2,
                    currentRow: currentRow,
                    shape: this.shape,
                    angle: this.angle,
                })
            );
        }
    }
    draw(pressed) {
        if (pressed) ctx.fillStyle = this.finalColor;
        else ctx.fillStyle = this.color;

        if (this.rotated) {
            ctx.fillRect(this.position.x + 10, this.position.y + 6, 16, 36 * this.boxCount - 12);
        } else {
            ctx.fillRect(this.position.x + 6, this.position.y + 10, 36 * this.boxCount - 12, 16);
        }
        this.ramps.forEach((ramp) => {
            ramp.draw();
        });
    }
    addValue(value) {
        this.position[this.direction] += value;
        this.hitbox.position[this.direction] += value;
        this.ramps.forEach((ramp) => {
            ramp.position[this.direction] += value;
        });
    }
    move(pressed) {
        if (pressed) {
            if (
                this.blocked &&
                ((this.blockedDirection == "up" && this.rotated) ||
                    (this.blockedDirection == "down" && !this.rotated))
            ) {
                this.blockedDirection = null;
                this.blocked = false;
                return;
            }
            if (this.position[this.direction] != this.finalPosition[this.direction]) {
                this.addValue(this.addingValue);
            }
            return;
        }

        if (
            this.blocked &&
            ((this.blockedDirection == "down" && this.rotated) ||
                (this.blockedDirection == "up" && !this.rotated))
        ) {
            this.blocked = false;
            this.blockedDirection = null;
            return;
        }

        if (this.position[this.direction] != this.startPosition[this.direction]) {
            this.addValue(this.addingValue * -1);
        }
    }
}
