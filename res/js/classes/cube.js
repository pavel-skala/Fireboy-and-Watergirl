import { ctx } from "../helpers.js";
import { Sprite } from "../sprite.js";

export class Cube extends Sprite {
    constructor({ position, collisionBlocks, allAssets, players }) {
        const imgSrc = "./res/img/cube.png";
        super({ position, imgSrc });

        this.position = position;
        this.velocity = {
            x: 0,
            y: 0,
        };

        this.hitbox = {
            position: {
                x: this.position.x + 2,
                y: this.position.y + 1,
            },
            width: 64,
            height: 66,
        };

        this.shape = "cube";
        this.isOnBlock = false;
        this.isOnRamp = false;

        this.collisionBlocks = collisionBlocks;
        this.allAssets = allAssets;
        this.players = players;

        this.rampBlocked = false;
    }
    hitboxPositionCalc() {
        this.hitbox.position = {
            x: this.position.x + 2,
            y: this.position.y + 1,
        };
    }
    update() {
        this.position.x += this.velocity.x;

        this.hitboxPositionCalc();
        this.horizontalCollision(this.allAssets);

        this.hitboxPositionCalc();
        this.horizontalCollision(this.players);

        this.hitboxPositionCalc();
        this.horizontalCollision(this.collisionBlocks);

        this.velocity.x = 0;
        this.gravity();

        this.isOnBlock = false;
        this.rampBlocked = false;
        this.hitboxPositionCalc();
        this.verticalCollision(this.collisionBlocks);

        this.isOnRamp = false;
        this.hitboxPositionCalc();
        this.verticalCollision(this.allAssets);

        this.hitboxPositionCalc();
        this.verticalCollision(this.players);

        this.hitboxPositionCalc();
    }
    gravity() {
        this.velocity.y += 0.25;
        this.position.y += this.velocity.y;
    }
    horizontalCollision(blocks) {
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            //block is this cube
            if (block == this) continue;

            if (
                this.hitbox.position.x <= block.hitbox.position.x + block.hitbox.width &&
                this.hitbox.position.x + this.hitbox.width >= block.hitbox.position.x &&
                this.hitbox.position.y + this.hitbox.height >= block.hitbox.position.y + 1 &&
                this.hitbox.position.y <= block.hitbox.position.y + block.hitbox.height
            ) {
                if (block.shape == "square" || block.shape == "ramp" || block.shape == "lever") {
                    if (this.rampBlocked) {
                        break;
                    }

                    //cube going right
                    if (this.velocity.x > 0) {
                        const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;
                        this.position.x = block.hitbox.position.x - offset - 0.01;
                        break;
                    }
                    //cube going left
                    else if (this.velocity.x < 0) {
                        const offset = this.hitbox.position.x - this.position.x;
                        this.position.x =
                            block.hitbox.position.x + block.hitbox.width - offset + 0.01;
                        break;
                    }
                } else if (block.constructor.name == "Player") {
                    //head collision
                    if (
                        this.hitbox.position.y + this.hitbox.height >
                            Math.round(block.hitbox.position.y) &&
                        this.hitbox.position.y <=
                            block.hitbox.position.y + block.hitbox.height - block.hitbox.legs.height
                    ) {
                        //cube going to left
                        if (this.velocity.x < 0) {
                            block.velocity.x -= 1;
                            const offset = this.hitbox.position.x - this.position.x;
                            this.position.x =
                                block.hitbox.position.x + block.hitbox.width - offset + 0.01;
                            break;
                        }
                        //cube going to right
                        else if (this.velocity.x > 0) {
                            block.velocity.x += 1;
                            const offset =
                                this.hitbox.position.x - this.position.x + this.hitbox.width;
                            this.position.x = block.hitbox.position.x - offset - 0.01;
                            break;
                        }
                    }
                }
            }
        }
    }
    calculateXPos(block) {
        let xPos;
        //triangle to left
        if (block.direction.x == "left") {
            xPos = (this.hitbox.position.x + this.hitbox.width) % 36;

            xPos = 36 - xPos;
            if (xPos == 36 || xPos < 1) xPos = 0;
        }
        //triangle to right
        else {
            xPos = this.hitbox.position.x % 36;

            if (xPos < 1) xPos = 0;
        }

        return xPos;
    }
    triangleChangePosition(block, xPos) {
        if (this.hitbox.position.y + this.hitbox.height >= block.hitbox.position.y + xPos) {
            this.isOnBlock = true;
            this.velocity.y = 0;
            const offset = this.hitbox.position.y + this.hitbox.height - this.position.y;
            this.position.y = block.hitbox.position.y + xPos - offset - 0.01;
        }
    }
    verticalCollision(blocks) {
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            //block is this cube
            if (block == this) continue;

            if (
                this.hitbox.position.x <= block.hitbox.position.x + block.hitbox.width &&
                this.hitbox.position.x + this.hitbox.width >= block.hitbox.position.x &&
                this.hitbox.position.y + this.hitbox.height >= block.hitbox.position.y &&
                this.hitbox.position.y <= block.hitbox.position.y + block.hitbox.height
            ) {
                if (block.shape == "square" || block.shape == "ramp" || block.shape == "lever") {
                    if (this.isOnRamp) {
                        this.rampBlocked = true;
                        break;
                    }
                    //cube blocking ramp down
                    if (
                        this.isOnBlock &&
                        block.shape == "ramp" &&
                        Math.round(this.hitbox.position.y) ==
                            block.hitbox.position.y + block.hitbox.height
                    ) {
                        block.blocked = true;
                        block.blockedDirection = "down";
                        break;
                    }
                    //cube top collision
                    if (
                        this.hitbox.position.y <= block.hitbox.position.y + block.hitbox.height &&
                        this.hitbox.position.y >= block.hitbox.position.y
                    ) {
                        this.velocity.y = 0;
                        const offset = this.hitbox.position.y - this.position.y;
                        this.position.y =
                            block.hitbox.position.y + block.hitbox.height - offset + 0.01;
                        break;
                    }
                    //cube going down bottom collision
                    if (
                        this.velocity.y > 0 &&
                        this.hitbox.position.y + this.hitbox.height >= block.hitbox.position.y
                    ) {
                        if (block.canMove) {
                            block.pressed = true;
                        }
                        if (block.shape == "ramp") {
                            this.isOnRamp = true;
                        }
                        this.isOnBlock = true;
                        const offset =
                            this.hitbox.position.y + this.hitbox.height - this.position.y;
                        this.velocity.y = 0;
                        this.position.y = block.hitbox.position.y - offset - 0.01;
                        break;
                    }
                } else if (block.shape == "button") {
                    block.pressed = true;
                    break;
                } else if (block.constructor.name == "Player") {
                    //cube going on players head
                    if (this.velocity.y > 0) {
                        const offset =
                            this.hitbox.position.y + this.hitbox.height - this.position.y;
                        this.velocity.y = 0;
                        this.position.y = block.hitbox.position.y - offset - 0.01;
                        break;
                    }

                    //player going down head collision
                    if (
                        this.hitbox.position.y >=
                        block.hitbox.position.y + block.hitbox.height - block.hitbox.legs.height
                    ) {
                        console.log("pepa");
                        //player going left
                        if (this.hitbox.position.x >= block.hitbox.position.x) {
                            block.sliding.left = true;
                            block.position.x -= 2;
                            this.velocity.x += 2;
                        }
                        //player going right
                        else {
                            block.sliding.right = true;
                            block.position.x += 2;
                            this.velocity.x -= 2;
                        }
                        break;
                    }
                }
                //triangle collision
                else if (block.shape == "triangle" && block.direction.y == "up") {
                    //triangle left
                    if (
                        block.direction.x == "left" &&
                        this.hitbox.position.x + this.hitbox.width > block.hitbox.position.x &&
                        this.hitbox.position.x + this.hitbox.width <=
                            block.hitbox.position.x + block.hitbox.width
                    ) {
                        let xPos = this.calculateXPos(block);
                        this.triangleChangePosition(block, xPos);
                        break;
                    }
                    //triangle right
                    else if (
                        block.direction.x == "right" &&
                        this.hitbox.position.x >= block.hitbox.position.x &&
                        this.hitbox.position.x < block.hitbox.position.x + block.hitbox.width
                    ) {
                        let xPos = this.calculateXPos(block);

                        this.triangleChangePosition(block, xPos);
                        break;
                    }
                }
            }
        }
    }
}
