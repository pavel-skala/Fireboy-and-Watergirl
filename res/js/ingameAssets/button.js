import { Sprite } from "../sprite.js";
import { ctx } from "../helpers.js";

export class Button extends Sprite {
    constructor({ position, color, finalColor, ramp }) {
        const imgSrc = "./res/img/button.png";
        super({ position, imgSrc });

        this.position = position;
        this.finalPosition = {
            x: position.x,
            y: position.y + 19,
        };

        this.startPosition = { ...position };
        this.color = color;
        this.finalColor = finalColor;

        this.hitbox = {
            position: {
                x: position.x,
                y: position.y,
            },
            width: 36 + 38,
            height: 18,
        };
        this.canMove = true;
        this.shape = "button";

        this.ramp = ramp;

        this.pressed = false;
    }
    run() {
        this.ramp.move(this.pressed);
        this.ramp.draw(this.pressed);
    }
    fillColor() {
        if (this.pressed) ctx.fillStyle = this.finalColor;
        else ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x + 22, this.position.y, 28, 10);
    }
    move(direction) {
        if (direction == "down") {
            this.position.y++;
            this.hitbox.position.y++;
        } else {
            this.position.y--;
            this.hitbox.position.y--;
        }
    }
    checkStandingOnButton(object, hitbox) {
        if (
            object.isOnBlock &&
            hitbox.position.x + hitbox.width >= this.hitbox.position.x &&
            hitbox.position.x <= this.hitbox.position.x + this.hitbox.width &&
            hitbox.position.y + hitbox.height >= this.hitbox.position.y - 2 &&
            hitbox.position.y + hitbox.height <= this.hitbox.position.y + this.hitbox.height
        ) {
            return true;
        }
        return false;
    }
}
