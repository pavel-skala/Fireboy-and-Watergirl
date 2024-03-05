import { Sprite } from "../sprite.js";
import { ctx } from "../helpers.js";

export class Lever extends Sprite {
    constructor({ position, color, finalColor, ramp }) {
        const imgSrc = "./res/img/lever.png";
        super({ position, imgSrc });

        this.position = position;

        this.color = color;
        this.finalColor = finalColor;

        this.origHitboxPosition = {
            x: position.x + 4,
            y: position.y + 2,
        };

        this.hitbox = {
            position: {
                x: position.x + 4,
                y: position.y + 2,
            },
            width: 10,
            height: 42,
        };

        this.angle = 30 * (Math.PI / 180);
        this.shape = "lever";

        this.ramp = ramp;
        this.pressed = false;

        this.base = new Sprite({
            position: {
                x: position.x - 27,
                y: position.y + 45,
            },
            imgSrc: "./res/img/leverBase.png",
        });

        this.centerPoint = {
            x: this.hitbox.position.x + this.hitbox.width / 2,
            y: this.hitbox.position.y + this.hitbox.height + 4,
        };

        this.calcRotatedPos();
    }
    calcRotatedPos() {
        this.hitbox.position = {
            x:
                this.centerPoint.x +
                (-this.hitbox.width / 2) * Math.cos(this.angle) -
                -this.hitbox.height * Math.sin(this.angle) -
                1,
            y:
                this.centerPoint.y +
                (this.origHitboxPosition.y - this.centerPoint.y) * Math.cos(this.angle),
        };
    }
    checkAngle() {
        if (this.angle >= 0 && Math.round(this.angle / (Math.PI / 180)) != 30) {
            this.angle += Math.PI / 180 / 2;
        } else if (this.angle < 0 && Math.round(this.angle / (Math.PI / 180)) != -30) {
            this.angle -= Math.PI / 180 / 2;
        }
        this.pressed = false;
        if (this.angle < 0) {
            this.pressed = true;
        }
    }
    run() {
        this.ramp.move(this.pressed);
        this.ramp.draw(this.pressed);
    }
    fillColor() {
        ctx.fillStyle = this.color;
        if (this.pressed) {
            ctx.fillStyle = this.finalColor;
        }
        ctx.fillRect(this.base.position.x + 12, this.base.position.y + 6, 48, 8);
        this.calcRotatedPos();
        ctx.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, 11);
    }
    drawLever() {
        this.fillColor();
        this.draw();
        this.base.draw();
    }
}
