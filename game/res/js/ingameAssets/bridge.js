import { ctx } from "../helpers.js";
import { Sprite } from "../sprite.js";

export class Bridge extends Sprite {
    constructor({ position, chainsCount }) {
        const imgSrc = "./res/img/wood.png";

        super({ position, imgSrc });

        this.position = position;

        this.hitbox = {
            position,
            width: 144,
            height: 36,
        };
        this.shape = "square";

        this.chainsCount = chainsCount;
        this.chains = [];

        for (let i = 0; i < chainsCount; i++) {
            this.chains.push(
                new Sprite({
                    position: {
                        x: position.x + this.hitbox.width / 2 - 7,
                        y: position.y - 70 * (i + 1),
                    },
                    imgSrc: "./res/img/chain.png",
                })
            );
        }
    }
    drawChain() {
        this.chains.forEach((chain) => {
            chain.draw();
        });

        ctx.fillStyle = "grey";
        ctx.beginPath();
        ctx.arc(
            this.position.x + this.hitbox.width / 2,
            this.position.y - this.chainsCount * 70,
            18,
            0,
            2 * Math.PI
        );
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}
