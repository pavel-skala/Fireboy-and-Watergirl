import { ctx } from "../helpers.js";
import { Sprite } from "../sprite.js";

export class Ball extends Sprite {
    constructor({ position, collisionBlocks, allAssets }) {
        const imgSrc = "./res/img/ball.png";

        super({ position, imgSrc });

        this.position = position;
        this.velocity = {
            x: 0,
            y: 0,
        };

        this.hitbox = {
            position: {
                x: this.position.x + 2,
                y: this.position.y + 2,
            },
            width: 28,
            height: 28,
        };
        this.collisionBlocks = collisionBlocks;
        this.allAssets = allAssets;

        this.shape = "ball";

        this.isOnBlock = false;

        this.lastPosition = { ...this.position };
        this.angle = 90 * (Math.PI / 180);
    }
    hitboxPositionCalc() {
        this.hitbox.position = {
            x: this.position.x + 1,
            y: this.position.y + 1,
        };
    }
    update() {
        this.lastPosition.x = this.position.x;
        this.position.x += this.velocity.x;

        this.hitboxPositionCalc();
        this.horizontalCollision(this.allAssets);

        this.hitboxPositionCalc();
        this.horizontalCollision(this.collisionBlocks);

        if (this.lastPosition.x != this.position.x) {
            this.angle += this.velocity.x * (Math.PI / 180) * 2;
        }

        if (this.velocity.x != 0) {
            this.velocity.x *= 0.995;

            if (Math.abs(this.velocity.x) < 0.01) {
                this.velocity.x = 0;
            }
        }
        this.gravity();

        this.hitboxPositionCalc();
        this.verticalCollision(this.collisionBlocks);

        this.hitboxPositionCalc();
        this.verticalCollision(this.allAssets);
    }
    gravity() {
        this.velocity.y += 0.25;
        this.position.y += this.velocity.y;
    }
    horizontalCollision(blocks) {
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            //block is this ball
            if (block == this) continue;

            if (
                this.hitbox.position.x <= block.hitbox.position.x + block.hitbox.width &&
                this.hitbox.position.x + this.hitbox.width >= block.hitbox.position.x &&
                this.hitbox.position.y + this.hitbox.height >= block.hitbox.position.y + 1 &&
                this.hitbox.position.y <= block.hitbox.position.y + block.hitbox.height
            ) {
                if (block.shape == "square" || block.shape == "ramp") {
                    //ball going right
                    if (this.velocity.x > 0) {
                        this.velocity.x = -this.velocity.x / 2;
                        const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;
                        this.position.x = block.hitbox.position.x - offset - 0.01;
                        break;
                    }
                    //ball going left
                    else if (this.velocity.x < 0) {
                        this.velocity.x = -this.velocity.x / 2;
                        const offset = this.hitbox.position.x - this.position.x;
                        this.position.x =
                            block.hitbox.position.x + block.hitbox.width - offset + 0.01;
                        break;
                    }
                } else if (
                    block.shape == "triangle" &&
                    block.direction.y == "up" &&
                    block.direction.x == "left"
                ) {
                    if (
                        this.hitbox.position.y <= block.hitbox.position.y + block.hitbox.height &&
                        this.hitbox.position.y + this.hitbox.height > block.hitbox.height &&
                        this.hitbox.position.x < block.hitbox.position.x + block.hitbox.width &&
                        this.hitbox.position.x + this.hitbox.width >
                            block.hitbox.position.x + block.hitbox.width &&
                        this.velocity.x < 0
                    ) {
                        const offset = this.hitbox.position.x - this.position.x;
                        this.position.x =
                            block.hitbox.position.x + block.hitbox.width - offset + 0.01;
                        break;
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
        //for triangle up
        if (
            block.direction.y == "up" &&
            this.hitbox.position.y + this.hitbox.height >= block.hitbox.position.y + xPos
        ) {
            this.isOnBlock = true;
            const offset = this.hitbox.position.y + this.hitbox.height - this.position.y;
            this.position.y = block.hitbox.position.y + xPos - offset - 0.01;
            this.velocity.y = 0;

            //ball changing velocity at triangle
            if (block.direction.x == "left") {
                if (this.velocity.x > 0.3) {
                    this.velocity.x *= 0.9;
                } else this.velocity.x--;
            } else if (block.direction.x == "right") {
                if (this.velocity.x < -0.3) {
                    this.velocity.x *= 0.9;
                } else this.velocity.x++;
            }
        }
        //for triangle down
        else if (
            block.direction.y == "down" &&
            this.hitbox.position.y < block.hitbox.position.y + block.hitbox.height - xPos
        ) {
            const offset = this.hitbox.position.y - this.position.y;
            this.position.y = block.hitbox.position.y + block.hitbox.height - xPos - offset + 0.01;
            this.velocity.y = 0;

            if (block.direction.x == "left" && this.velocity.x > 0) {
                this.velocity.x = -this.velocity.x / 3;
            } else if (block.direction.x == "right" && this.velocity.x < 0) {
                this.velocity.x = -this.velocity.x / 3;
            }
            this.velocity.y++;
        }
    }
    verticalCollision(blocks) {
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            //block is this ball
            if (block == this) continue;

            if (
                this.hitbox.position.x <= block.hitbox.position.x + block.hitbox.width &&
                this.hitbox.position.x + this.hitbox.width >= block.hitbox.position.x &&
                this.hitbox.position.y + this.hitbox.height >= block.hitbox.position.y &&
                this.hitbox.position.y <= block.hitbox.position.y + block.hitbox.height
            ) {
                if (block.shape == "square" || block.shape == "ramp") {
                    //ball top collision
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
                    //ball going down bottom collision
                    if (
                        this.velocity.y > 0 &&
                        this.hitbox.position.y + this.hitbox.height >= block.hitbox.position.y
                    ) {
                        if (block.canMove) {
                            block.pressed = true;
                        }
                        if (block.shape == "ramp") {
                            this.isOnRamp = true;
                            if (this.velocity.x > 0) this.velocity.x += 0.005;
                            else if (this.velocity.x < 0) this.velocity.x -= 0.005;
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
                //triangle collision
                else if (block.shape == "triangle" && block.direction.y == "down") {
                    //triangle left
                    if (
                        block.direction.x == "left" &&
                        this.hitbox.position.x + this.hitbox.width >= block.hitbox.position.x &&
                        this.hitbox.position.x + this.hitbox.width <=
                            block.hitbox.position.x + block.hitbox.width &&
                        this.hitbox.position.y > block.hitbox.position.y
                    ) {
                        let xPos = this.calculateXPos(block);
                        this.triangleChangePosition(block, xPos);
                        break;
                    }
                    //triangle right
                    else if (
                        block.direction.x == "right" &&
                        this.hitbox.position.x < block.hitbox.position.x + block.hitbox.width &&
                        this.hitbox.position.x + this.hitbox.width > block.hitbox.position.x &&
                        this.hitbox.position.y > block.hitbox.position.y
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
