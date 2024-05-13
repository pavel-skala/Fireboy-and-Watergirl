import { Sprite } from "./sprite.js";

export class Player extends Sprite {
    constructor({
        position,
        collisionBlocks,
        allAssets,
        diamonds,
        doors,
        imgSrc,
        frameRate,
        frameDelay,
        currentRow,
        imgRows,
        legs,
        keys,
        animations,
        element,
    }) {
        super({ position, imgSrc, frameRate, frameDelay, currentRow, imgRows, animations });
        this.position = position;
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.keys = keys;
        this.element = element;

        this.collisionBlocks = collisionBlocks;
        this.allAssets = allAssets;
        this.diamonds = diamonds;
        this.doors = doors;

        this.isOnBlock = false;

        this.lastPosition = position;

        this.hitbox = {
            position: {
                x: this.position.x + 4,
                y: this.position.y + 12,
            },
            width: 36,
            height: 60,
            legs: {
                position: {
                    x: this.position.x,
                    y: this.position.y,
                },
                width: 12,
                height: 24,
            },
        };

        this.legs = legs;

        this.sliding = {
            left: false,
            right: false,
        };

        this.currentAnimation = "idle";

        this.died = false;

        this.rampBlocked = false;
        this.isOnRamp = false;
    }
    update() {
        this.hitboxPositionCalc();
        this.lastPosition = this.hitbox.position;

        // ctx.fillStyle = "rgba(0,0,255,0.5)";
        // ctx.fillRect(
        //     this.hitbox.position.x,
        //     this.hitbox.position.y,
        //     this.hitbox.width,
        //     this.hitbox.height - this.hitbox.legs.height
        // );
        // ctx.fillStyle = "rgba(0,255,0, 0.5)";
        // ctx.fillRect(
        //     this.hitbox.legs.position.x,
        //     this.hitbox.legs.position.y,
        //     this.hitbox.legs.width,
        //     this.hitbox.legs.height
        // );

        this.position.x += this.velocity.x;

        this.hitboxPositionCalc();
        this.horizontalCollision(this.allAssets);

        this.hitboxPositionCalc();
        this.horizontalCollision(this.collisionBlocks);

        //gravity
        this.gravity();

        this.hitboxPositionCalc();
        this.isOnBlock = false;
        this.sliding.right = false;
        this.sliding.left = false;
        this.rampBlocked = false;
        this.verticalCollision(this.collisionBlocks);

        this.hitboxPositionCalc();
        this.isOnRamp = false;
        this.verticalCollision(this.allAssets);

        this.hitboxPositionCalc();
        this.calculateAngle();

        this.legs.position = {
            x: this.position.x + 37,
            y: this.position.y + 72,
        };
    }
    changeSprite(name) {
        if (name != this.currentAnimation) {
            //head animation
            this.currentFrame = 0;
            this.frameCount = 0;

            this.frameRate = this.animations[name].frameRate;
            this.currentRow = this.animations[name].currentRow;
            if (this.animations[name].flipImage) this.flipImage = true;
            else this.flipImage = false;

            this.currentAnimation = name;

            if (name == "up" || name == "down") {
                name = "idle";
            }

            //legs animation
            this.legs.currentFrame = 0;
            this.legs.frameCount = 0;

            this.legs.frameRate = this.legs.animations[name].frameRate;
            this.legs.currentRow = this.legs.animations[name].currentRow;
            if (this.legs.animations[name].flipImage) this.legs.flipImage = true;
            else this.legs.flipImage = false;
        }
    }
    checkDiamonds() {
        for (let i = 0; i < this.diamonds.length; i++) {
            let diamond = this.diamonds[i];
            if (
                (diamond.type == "final" || this.element == diamond.type) &&
                this.hitbox.position.x <= diamond.hitbox.position.x + diamond.hitbox.width &&
                this.hitbox.position.x + this.hitbox.width >= diamond.hitbox.position.x &&
                this.hitbox.position.y <= diamond.hitbox.position.y + diamond.hitbox.height &&
                this.hitbox.position.y + this.hitbox.height >= diamond.hitbox.position.y
            ) {
                //collect diamond
                this.diamonds.splice(i, 1);
            }
        }
    }
    checkDoors() {
        this.doors.forEach((door) => {
            if (
                this.element == door.element &&
                this.hitbox.position.x >= door.hitbox.position.x &&
                this.hitbox.position.x + this.hitbox.width <=
                    door.hitbox.position.x + door.hitbox.width &&
                this.hitbox.position.y >= door.hitbox.position.y &&
                this.hitbox.position.y + this.hitbox.height <=
                    door.hitbox.position.y + door.hitbox.height
            ) {
                door.pressed = true;
                return;
            }
        });
    }
    calculateAngle() {
        this.angle =
            Math.atan2(
                this.hitbox.position.y - this.lastPosition.y,
                Math.abs(this.hitbox.position.x - this.lastPosition.x)
            ) / 4;
        if (this.angle > 0) {
            this.angle /= 1.5;
        }
        if (this.velocity.y == 0) {
            this.angle = 0;
        }
    }
    hitboxPositionCalc() {
        this.hitbox.position = {
            x: this.position.x + 31,
            y: this.position.y + 37,
        };
        this.hitbox.legs.position = {
            x: this.hitbox.position.x + (this.hitbox.width - this.hitbox.legs.width) / 2,
            y: this.hitbox.position.y + this.hitbox.height - this.hitbox.legs.height,
        };
    }
    gravity() {
        // this.velocity.y += 0.5;
        if (this.velocity.y < 0) {
            this.velocity.y += 0.07;
            if (this.velocity.y > -0.001) {
                this.velocity.y = 0;
            }
        } else if (this.velocity.y > 0) {
            if (this.velocity.y >= 1.6) {
                // this.velocity.y = 1.7
                this.velocity.y += 0.02;
            } else {
                this.velocity.y += 0.07;
                // this.velocity.y += 1
            }
        }
        // else if (this.velocity.y == 0) this.velocity.y = 1.7;
        else this.velocity.y = 2.02;
        // this.velocity.y += 0.08;
        this.position.y += this.velocity.y;
    }
    horizontalCollision(blocks) {
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];

            if (
                this.hitbox.position.x <= block.hitbox.position.x + block.hitbox.width &&
                this.hitbox.position.x + this.hitbox.width >= block.hitbox.position.x &&
                this.hitbox.position.y + this.hitbox.height >= block.hitbox.position.y + 1 &&
                this.hitbox.position.y <= block.hitbox.position.y + block.hitbox.height
            ) {
                //ramp blocked
                if (this.rampBlocked) {
                    break;
                }

                if (
                    block.shape == "square" ||
                    block.shape == "ramp" ||
                    block.shape == "lever" ||
                    block.shape == "cube" ||
                    block.shape == "pondTriangle"
                ) {
                    //collision not from side
                    if (
                        block.shape == "pondTriangle" &&
                        ((block.direction.x == "left" &&
                            this.hitbox.legs.position.x + this.hitbox.legs.width <=
                                block.hitbox.position.x + block.hitbox.width &&
                            block.hitbox.width) ||
                            (block.direction.x == "right" && this.velocity.x < 0))
                    ) {
                        break;
                    }

                    //head collision
                    if (
                        this.hitbox.position.y + this.hitbox.height - this.hitbox.legs.height >=
                            block.hitbox.position.y &&
                        Math.round(this.hitbox.position.y) <
                            block.hitbox.position.y + block.hitbox.height &&
                        !this.sliding.right &&
                        !this.sliding.left
                    ) {
                        let moveTo;
                        if (block.shape == "lever") {
                            //pushing lever to left
                            if (
                                this.velocity.x < 0 &&
                                Math.round(block.angle / (Math.PI / 180)) > -30
                            ) {
                                block.angle -= Math.PI / 180;
                            }
                            //pushing lever to right
                            else if (
                                this.velocity.x > 0 &&
                                Math.round(block.angle / (Math.PI / 180)) < 30
                            ) {
                                block.angle += Math.PI / 180;
                            }
                            //lever pushing player to left
                            else if (
                                this.velocity.x == 0 &&
                                this.hitbox.position.x <= block.hitbox.position.x
                            ) {
                                moveTo = "left";
                            }
                            //lever pushing player to right
                            else if (
                                this.velocity.x == 0 &&
                                this.hitbox.position.x >= block.hitbox.position.x
                            ) {
                                moveTo = "right";
                            }
                        } else if (block.shape == "cube") {
                            if (this.velocity.x > 0) {
                                block.velocity.x = 1.5;
                            } else {
                                block.velocity.x = -1.5;
                            }
                        }
                        //player going to left
                        if (this.velocity.x < 0 || moveTo == "right") {
                            const offset = this.hitbox.position.x - this.position.x;
                            this.position.x =
                                block.hitbox.position.x + block.hitbox.width - offset + 0.01;
                            break;
                        }
                        //player going to right
                        else if (this.velocity.x > 0 || moveTo == "left") {
                            const offset =
                                this.hitbox.position.x - this.position.x + this.hitbox.width;
                            this.position.x = block.hitbox.position.x - offset - 0.01;
                            break;
                        }
                    }
                    //player sliding
                    else if (this.sliding.left) this.position.x--;
                    else if (this.sliding.right) this.position.x++;
                    //legs collision
                    else if (
                        this.hitbox.legs.position.y + this.hitbox.legs.height >=
                            block.hitbox.position.y &&
                        this.hitbox.legs.position.y <= block.hitbox.position.y + block.hitbox.height
                    ) {
                        if (block.shape == "cube") {
                            if (this.velocity.x > 0) {
                                block.velocity.x = 1.5;
                            } else {
                                block.velocity.x = -1.5;
                            }
                        }
                        //player going to left
                        if (
                            this.velocity.x < 0 &&
                            this.hitbox.legs.position.x <=
                                block.hitbox.position.x + block.hitbox.width &&
                            this.hitbox.legs.position.x + this.hitbox.legs.width >=
                                block.hitbox.position.x
                        ) {
                            const offset = this.hitbox.legs.position.x - this.position.x;
                            this.position.x =
                                block.hitbox.position.x + block.hitbox.width - offset + 0.01;
                            break;
                        }
                        //player going to right
                        else if (
                            this.velocity.x > 0 &&
                            this.hitbox.legs.position.x + this.hitbox.legs.width >=
                                block.hitbox.position.x &&
                            this.hitbox.legs.position.x <= block.hitbox.position.x
                        ) {
                            const offset =
                                this.hitbox.legs.position.x -
                                this.position.x +
                                this.hitbox.legs.width;
                            this.position.x = block.hitbox.position.x - offset - 0.01;
                            break;
                        }
                    }
                }
                //collision for ball
                else if (block.shape == "ball") {
                    //legs collision
                    if (
                        this.hitbox.position.y + this.hitbox.height >= block.hitbox.position.y &&
                        this.hitbox.position.y < block.hitbox.position.y + block.hitbox.height
                    ) {
                        //player going to left
                        if (
                            this.velocity.x < 0 &&
                            this.hitbox.legs.position.x <=
                                block.hitbox.position.x + block.hitbox.width &&
                            this.hitbox.legs.position.x + this.hitbox.legs.width >=
                                block.hitbox.position.x
                        ) {
                            block.velocity.x = Math.min(2, block.velocity.x - 0.5);

                            const offset = this.hitbox.legs.position.x - this.position.x;
                            this.position.x =
                                block.hitbox.position.x + block.hitbox.width - offset + 0.01;
                            break;
                        }
                        //player going to right
                        else if (
                            this.velocity.x > 0 &&
                            this.hitbox.legs.position.x + this.hitbox.legs.width >=
                                block.hitbox.position.x &&
                            this.hitbox.legs.position.x <= block.hitbox.position.x
                        ) {
                            block.velocity.x = Math.min(2, block.velocity.x + 0.5);

                            const offset =
                                this.hitbox.legs.position.x -
                                this.position.x +
                                this.hitbox.legs.width;
                            this.position.x = block.hitbox.position.x - offset - 0.01;
                            break;
                        }
                    }
                }
                //triangle collision
                else if (block.shape == "triangle") {
                    if (block.direction.y == "down" && this.isOnBlock) {
                        if (
                            block.direction.x == "left" &&
                            this.hitbox.position.x + this.hitbox.width >
                                block.hitbox.position.x + 10 &&
                            this.hitbox.position.x + this.hitbox.width <
                                block.hitbox.position.x + block.hitbox.width &&
                            this.hitbox.position.y > block.hitbox.position.y &&
                            this.hitbox.position.y < block.hitbox.position.y + 18
                        ) {
                            const offset =
                                this.hitbox.position.x - this.position.x + this.hitbox.width - 10;
                            this.position.x = block.hitbox.position.x - offset - 0.01;
                            break;
                        } else if (
                            block.direction.x == "right" &&
                            this.hitbox.position.x <
                                block.hitbox.position.x + block.hitbox.width - 10 &&
                            this.hitbox.position.x > block.hitbox.position.x &&
                            this.hitbox.position.y > block.hitbox.position.y &&
                            this.hitbox.position.y < block.hitbox.position.y + 18
                        ) {
                            const offset = this.hitbox.position.x - this.position.x;
                            this.position.x =
                                block.hitbox.position.x + block.hitbox.width - offset + 0.01;
                            break;
                        }
                    }
                    if (
                        block.direction.x == "left" &&
                        this.hitbox.position.x <= block.hitbox.position.x + block.hitbox.width &&
                        this.hitbox.position.x >= block.hitbox.position.x &&
                        this.velocity.x < 0
                    ) {
                        //head collision
                        if (
                            this.hitbox.position.y + this.hitbox.height - this.hitbox.legs.height >=
                                block.hitbox.position.y &&
                            Math.round(this.hitbox.position.y) <
                                block.hitbox.position.y + block.hitbox.height &&
                            !this.sliding.right &&
                            !this.sliding.left
                        ) {
                            const offset = this.hitbox.position.x - this.position.x;
                            this.position.x =
                                block.hitbox.position.x + block.hitbox.width - offset + 0.01;
                            break;
                        }
                        //legs collision
                        else if (
                            this.hitbox.legs.position.y + this.hitbox.legs.height >
                                block.hitbox.position.y &&
                            this.hitbox.legs.position.y + this.hitbox.legs.height <=
                                block.hitbox.position.y + block.hitbox.height &&
                            this.hitbox.legs.position.x <=
                                block.hitbox.position.x + block.hitbox.width &&
                            this.hitbox.legs.position.x + this.hitbox.legs.width >=
                                block.hitbox.position.x + block.hitbox.width &&
                            this.velocity.y != 0
                        ) {
                            const offset = this.hitbox.legs.position.x - this.position.x;
                            this.position.x =
                                block.hitbox.position.x + block.hitbox.width - offset + 0.01;
                            break;
                        }
                    } else if (
                        block.direction.x == "right" &&
                        this.hitbox.position.x + this.hitbox.width >= block.hitbox.position.x &&
                        this.hitbox.position.x + this.hitbox.width <=
                            block.hitbox.position.x + block.hitbox.width &&
                        this.velocity.x > 0
                    ) {
                        //head collision
                        if (
                            this.hitbox.position.y + this.hitbox.height - this.hitbox.legs.height >=
                                block.hitbox.position.y &&
                            Math.round(this.hitbox.position.y) <
                                block.hitbox.position.y + block.hitbox.height &&
                            !this.sliding.right &&
                            !this.sliding.left
                        ) {
                            const offset =
                                this.hitbox.position.x - this.position.x + this.hitbox.width;
                            this.position.x = block.hitbox.position.x - offset - 0.01;
                            break;
                        }
                        //legs collision
                        else if (
                            this.hitbox.legs.position.y + this.hitbox.legs.height >
                                block.hitbox.position.y &&
                            this.hitbox.legs.position.y + this.hitbox.legs.height <=
                                block.hitbox.position.y + block.hitbox.height &&
                            this.hitbox.legs.position.x + this.hitbox.legs.width >=
                                block.hitbox.position.x &&
                            this.hitbox.legs.position.x <= block.hitbox.position.x &&
                            this.velocity.y != 0
                        ) {
                            const offset =
                                this.hitbox.legs.position.x -
                                this.position.x +
                                this.hitbox.legs.width;
                            this.position.x = block.hitbox.position.x - offset - 0.01;
                            break;
                        }
                    }
                    //triangle up collision
                    if (block.direction.y == "up" && this.isOnBlock == false) {
                        //head collision
                        if (
                            this.hitbox.position.y + this.hitbox.height - this.hitbox.legs.height >=
                                block.hitbox.position.y + block.hitbox.height &&
                            this.hitbox.position.y <=
                                block.hitbox.position.y + block.hitbox.height &&
                            !this.sliding.left &&
                            !this.sliding.right
                        ) {
                            //player going to left
                            if (this.velocity.x < 0) {
                                const offset = this.hitbox.position.x - this.position.x;
                                this.position.x =
                                    block.hitbox.position.x + block.hitbox.width - offset + 0.01;
                                break;
                            }
                            //player going to right
                            else if (this.velocity.x > 0) {
                                const offset =
                                    this.hitbox.position.x - this.position.x + this.hitbox.width;
                                this.position.x = block.hitbox.position.x - offset - 0.01;
                                break;
                            }
                        }
                        //player sliding
                        else if (this.sliding.left) this.position.x--;
                        else if (this.sliding.right) this.position.x++;
                        //legs collision
                        else if (
                            this.hitbox.legs.position.y + this.hitbox.legs.height >=
                                block.hitbox.position.y + block.hitbox.height &&
                            this.hitbox.legs.position.y <=
                                block.hitbox.position.y + block.hitbox.height
                        ) {
                            //triangle left
                            if (
                                block.direction.x == "right" &&
                                this.hitbox.legs.position.x <=
                                    block.hitbox.position.x + block.hitbox.width &&
                                this.lastPosition.x +
                                    (this.hitbox.width - this.hitbox.legs.width) / 2 >=
                                    block.hitbox.position.x + block.hitbox.width
                            ) {
                                const offset = this.hitbox.legs.position.x - this.position.x;
                                this.position.x =
                                    block.hitbox.position.x + block.hitbox.width - offset + 0.01;
                                break;
                            }
                            //triangle right
                            else if (
                                block.direction.x == "left" &&
                                this.hitbox.legs.position.x + this.hitbox.legs.width >=
                                    block.hitbox.position.x &&
                                this.lastPosition.x +
                                    (this.hitbox.width - this.hitbox.legs.width) / 2 +
                                    this.hitbox.legs.width <=
                                    block.hitbox.position.x
                            ) {
                                const offset =
                                    this.hitbox.legs.position.x -
                                    this.position.x +
                                    this.hitbox.legs.width;
                                this.position.x = block.hitbox.position.x - offset - 0.01;
                                break;
                            }
                        }
                    }
                    //triangle down collision
                    else if (block.direction.y == "down" && this.isOnBlock == false) {
                        //head collision
                        if (
                            this.hitbox.position.y + this.hitbox.height - this.hitbox.legs.height >=
                                block.hitbox.position.y &&
                            this.hitbox.position.y <= block.hitbox.position.y &&
                            !this.sliding.left &&
                            !this.sliding.right
                        ) {
                            //player going to left
                            if (this.velocity.x < 0) {
                                const offset = this.hitbox.position.x - this.position.x;
                                this.position.x =
                                    block.hitbox.position.x + block.hitbox.width - offset + 0.01;
                                break;
                            }
                            //player going to right
                            else if (this.velocity.x > 0) {
                                const offset =
                                    this.hitbox.position.x - this.position.x + this.hitbox.width;
                                this.position.x = block.hitbox.position.x - offset - 0.01;
                                break;
                            }
                        }
                        //player sliding
                        else if (this.sliding.left) this.position.x--;
                        else if (this.sliding.right) this.position.x++;
                        //legs collision
                        else if (
                            this.hitbox.legs.position.y + this.hitbox.legs.height >=
                                block.hitbox.position.y &&
                            this.hitbox.legs.position.y <= block.hitbox.position.y
                        ) {
                            //triangle left
                            if (
                                block.direction.x == "right" &&
                                this.hitbox.legs.position.x <=
                                    block.hitbox.position.x + block.hitbox.width &&
                                this.lastPosition.x +
                                    (this.hitbox.width - this.hitbox.legs.width) / 2 >=
                                    block.hitbox.position.x + block.hitbox.width
                            ) {
                                const offset = this.hitbox.legs.position.x - this.position.x;
                                this.position.x =
                                    block.hitbox.position.x + block.hitbox.width - offset + 0.01;
                                break;
                            }
                            //triangle right
                            else if (
                                block.direction.x == "left" &&
                                this.hitbox.legs.position.x + this.hitbox.legs.width >=
                                    block.hitbox.position.x &&
                                this.lastPosition.x +
                                    (this.hitbox.width - this.hitbox.legs.width) / 2 +
                                    this.hitbox.legs.width <=
                                    block.hitbox.position.x
                            ) {
                                const offset =
                                    this.hitbox.legs.position.x -
                                    this.position.x +
                                    this.hitbox.legs.width;
                                this.position.x = block.hitbox.position.x - offset - 0.01;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    calculateXPos(block) {
        let xPos;
        //triangle up
        if (block.direction.y == "up") {
            xPos = this.hitbox.legs.position.x % 36;
            //triangle to left
            if (block.direction.x == "left") {
                xPos = (this.hitbox.legs.position.x + this.hitbox.legs.width) % 36;

                xPos = 36 - xPos;
                if (xPos == 36 || xPos < 1) xPos = 0;
            }
            //triangle to right
            else if (xPos < 1) xPos = 0;

            if (block.shape == "pondTriangle") xPos /= 2;
        }
        //triangle down
        else {
            xPos = this.hitbox.position.x % 36;

            if (block.direction.x == "left") xPos = 36 - xPos;
            else {
                if (xPos == 0) xPos = 36;
                else if (xPos < 1) xPos = 0;
            }
        }
        return xPos;
    }
    //change position for collision in triangle
    triangleChangePosition(block, xPos) {
        //for triangle up
        if (
            block.direction.y == "up" &&
            this.hitbox.position.y + this.hitbox.height >= block.hitbox.position.y + xPos
        ) {
            this.isOnBlock = true;
            this.velocity.y = 0;
            const offset = this.hitbox.position.y + this.hitbox.height - this.position.y;
            this.position.y = block.hitbox.position.y + xPos - offset - 0.01;
            if (block.shape == "triangle") {
                if (block.direction.x == "left") this.position.x -= 0.5;
                else this.position.x += 0.5;
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
        }
    }
    verticalCollision(blocks) {
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];

            if (
                this.hitbox.position.x <= block.hitbox.position.x + block.hitbox.width &&
                this.hitbox.position.x + this.hitbox.width >= block.hitbox.position.x &&
                this.hitbox.position.y + this.hitbox.height >= block.hitbox.position.y &&
                this.hitbox.position.y <= block.hitbox.position.y + block.hitbox.height
            ) {
                //collision for square
                if (
                    block.shape == "square" ||
                    block.shape == "ramp" ||
                    block.shape == "lever" ||
                    block.shape == "cube"
                ) {
                    //ramp is blocked
                    if (
                        this.isOnRamp &&
                        Math.round(this.hitbox.position.y) <=
                            block.hitbox.position.y + block.hitbox.height &&
                        Math.round(this.hitbox.position.y) >= block.hitbox.position.y
                    ) {
                        this.rampBlocked = true;
                        break;
                    }

                    //player going down legs collision
                    if (
                        this.velocity.y >= 0 &&
                        this.hitbox.legs.position.x <
                            block.hitbox.position.x + block.hitbox.width &&
                        this.hitbox.legs.position.x + this.hitbox.legs.width >
                            block.hitbox.position.x &&
                        this.hitbox.position.y + this.hitbox.height >= block.hitbox.position.y &&
                        this.hitbox.position.y + this.hitbox.height <=
                            block.hitbox.position.y + block.hitbox.height
                    ) {
                        if (block.shape == "button") {
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
                    //player going down head collision
                    else if (
                        this.velocity.y > 0 &&
                        this.hitbox.position.y + this.hitbox.height - this.hitbox.legs.height >=
                            block.hitbox.position.y
                    ) {
                        //player going left
                        if (this.hitbox.position.x <= block.hitbox.position.x) {
                            this.position.x -= 3;
                            this.sliding.left = true;
                        }
                        //player going right
                        else {
                            this.position.x += 3;
                            this.sliding.right = true;
                        }
                        break;
                    }
                    //player going up
                    else if (
                        this.velocity.y < 0 &&
                        this.hitbox.position.y <= block.hitbox.position.y + block.hitbox.height &&
                        this.hitbox.position.y >= block.hitbox.position.y
                    ) {
                        this.velocity.y = 0;
                        const offset = this.hitbox.position.y - this.position.y;
                        this.position.y =
                            block.hitbox.position.y + block.hitbox.height - offset + 0.01;
                        //player blocking ramp
                        if (
                            block.shape == "ramp" &&
                            Math.round(this.position.y + offset) ==
                                block.hitbox.position.y + block.hitbox.height
                        ) {
                            block.blocked = true;
                            block.blockedDirection = "down";
                        }
                        break;
                    }
                    //player blocking ramp
                    else if (
                        this.isOnBlock &&
                        block.shape == "ramp" &&
                        Math.round(this.hitbox.position.y) ==
                            block.hitbox.position.y + block.hitbox.height
                    ) {
                        block.blocked = true;
                        block.blockedDirection = "down";
                        break;
                    }
                }
                //collision for button
                else if (block.shape == "button") {
                    if (
                        this.hitbox.legs.position.x <
                            block.hitbox.position.x + block.hitbox.width &&
                        this.hitbox.legs.position.x + this.hitbox.legs.width >
                            block.hitbox.position.x
                    ) {
                        block.pressed = true;
                    }
                }
                //collision for ball
                else if (block.shape == "ball") {
                    //player going down legs collision
                    if (
                        this.velocity.y >= 0 &&
                        this.hitbox.legs.position.x <
                            block.hitbox.position.x + block.hitbox.width &&
                        this.hitbox.legs.position.x + this.hitbox.legs.width >
                            block.hitbox.position.x &&
                        this.hitbox.position.y + this.hitbox.height >= block.hitbox.position.y &&
                        this.hitbox.position.y + this.hitbox.height <=
                            block.hitbox.position.y + block.hitbox.height
                    ) {
                        this.isOnBlock = true;
                        const offset =
                            this.hitbox.position.y + this.hitbox.height - this.position.y;

                        this.velocity.y = 0;
                        this.position.y = block.hitbox.position.y - offset - 0.01;
                        break;
                    }
                }
                //collision for triangle left
                else if (block.direction.x == "left") {
                    //player going down head collision
                    if (
                        block.shape == "pondTriangle" &&
                        this.velocity.y > 0 &&
                        this.hitbox.position.y + this.hitbox.height - this.hitbox.legs.height >=
                            block.hitbox.position.y &&
                        this.hitbox.legs.position.x >= block.hitbox.position.x + block.hitbox.width
                    ) {
                        this.position.x += 3;
                        this.sliding.right = true;
                        break;
                    }

                    //player going from down to triangle
                    else if (
                        block.direction.y == "up" &&
                        this.lastPosition.y >= block.hitbox.position.y + block.hitbox.height
                    ) {
                        const offset = this.hitbox.position.y - this.position.y;
                        this.velocity.y = 0;
                        this.position.y =
                            block.hitbox.position.y + block.hitbox.height - offset + 0.01;
                        break;
                    }
                    // player standing on triangle
                    else if (
                        block.direction.y == "up" &&
                        this.hitbox.legs.position.x + this.hitbox.legs.width >
                            block.hitbox.position.x + block.hitbox.width &&
                        this.hitbox.legs.position.x <= block.hitbox.position.x + block.hitbox.width
                    ) {
                        this.isOnBlock = true;
                        const offset =
                            this.hitbox.position.y + this.hitbox.height - this.position.y;

                        this.velocity.y = 0;
                        this.position.y = block.hitbox.position.y - offset - 0.01;
                        break;
                    }
                    //check collision for triangle up left
                    else if (
                        block.direction.y == "up" &&
                        this.hitbox.legs.position.x + this.hitbox.legs.width >
                            block.hitbox.position.x &&
                        this.hitbox.legs.position.x + this.hitbox.legs.width <
                            block.hitbox.position.x + block.hitbox.width
                    ) {
                        let xPos = this.calculateXPos(block);

                        this.triangleChangePosition(block, xPos);
                        break;
                    }
                    // check collision for triangle down left
                    else if (
                        block.direction.y == "down" &&
                        this.velocity.y < 0 &&
                        this.hitbox.position.x + this.hitbox.width >
                            block.hitbox.position.x + block.hitbox.width &&
                        this.hitbox.position.x <= block.hitbox.position.x + block.hitbox.width &&
                        this.hitbox.position.y < block.hitbox.position.y + block.hitbox.height &&
                        this.hitbox.position.y > block.hitbox.position.y
                    ) {
                        this.velocity.y = 0;
                        const offset = this.hitbox.position.y - this.position.y;
                        this.position.y =
                            block.hitbox.position.y + block.hitbox.height - offset + 0.01;
                        break;
                    }
                    // check collision for triangle down left
                    else if (
                        block.direction.y == "down" &&
                        this.velocity.y < 0 &&
                        this.hitbox.position.x + this.hitbox.width >= block.hitbox.position.x &&
                        this.hitbox.position.x + this.hitbox.width <=
                            block.hitbox.position.x + block.hitbox.width &&
                        this.hitbox.position.y > block.hitbox.position.y
                    ) {
                        let xPos = this.calculateXPos(block);
                        this.triangleChangePosition(block, xPos);
                        break;
                    }
                    //player going down to triangle down
                    else if (
                        block.direction.y == "down" &&
                        this.velocity.y >= 0 &&
                        this.hitbox.legs.position.x <
                            block.hitbox.position.x + block.hitbox.width &&
                        this.hitbox.legs.position.x + this.hitbox.legs.width >
                            block.hitbox.position.x &&
                        this.hitbox.position.y + this.hitbox.height >= block.hitbox.position.y &&
                        this.hitbox.position.y + this.hitbox.height <=
                            block.hitbox.position.y + block.hitbox.height
                    ) {
                        this.isOnBlock = true;
                        const offset =
                            this.hitbox.position.y + this.hitbox.height - this.position.y;

                        this.velocity.y = 0;
                        this.position.y = block.hitbox.position.y - offset - 0.01;
                        break;
                    }
                    //player going down head collision
                    else if (
                        this.velocity.y > 0 &&
                        this.hitbox.position.y + this.hitbox.height - this.hitbox.legs.height >=
                            block.hitbox.position.y &&
                        this.hitbox.legs.position.x > block.hitbox.position.x + block.hitbox.width
                    ) {
                        this.position.x += 3;
                        this.sliding.right = true;
                        break;
                    }
                    //player going down head collision
                    else if (block.direction.y == "up" && this.velocity.y > 0) {
                        let myBlock = {
                            direction: {
                                x: block.direction.x,
                                y: "down",
                            },
                        };
                        let xPos = this.calculateXPos(myBlock);
                        if (
                            this.hitbox.position.y + this.hitbox.height - this.hitbox.legs.height >=
                            block.hitbox.position.y + xPos
                        ) {
                            this.position.x--;
                            this.sliding.left = true;
                            break;
                        }
                    }
                }
                //collision for triangle right
                else if (block.direction.x == "right") {
                    //player going down head collision
                    if (
                        block.shape == "pondTriangle" &&
                        this.velocity.y > 0 &&
                        this.hitbox.position.y + this.hitbox.height - this.hitbox.legs.height >=
                            block.hitbox.position.y
                    ) {
                        this.position.x -= 3;
                        this.sliding.left = true;
                        break;
                    }
                    //check pond
                    if (
                        block.shape == "pondTriangle" &&
                        this.element != block.element &&
                        this.hitbox.position.y + this.hitbox.height >=
                            block.hitbox.position.y + 10 &&
                        this.hitbox.position.y <= block.hitbox.position.y &&
                        this.hitbox.legs.position.x > block.hitbox.position.x
                    ) {
                        //end
                        this.died = true;
                        break;
                    }

                    //player going from down to triangle
                    if (
                        block.direction.y == "up" &&
                        this.lastPosition.y >= block.hitbox.position.y + block.hitbox.height
                    ) {
                        const offset = this.hitbox.position.y - this.position.y;
                        this.velocity.y = 0;
                        this.position.y =
                            block.hitbox.position.y + block.hitbox.height - offset + 0.01;
                        break;
                    }
                    // player standing on triangle
                    else if (
                        block.direction.y == "up" &&
                        this.hitbox.legs.position.x < block.hitbox.position.x &&
                        this.hitbox.legs.position.x + this.hitbox.legs.width >=
                            block.hitbox.position.x
                    ) {
                        this.isOnBlock = true;
                        const offset =
                            this.hitbox.position.y + this.hitbox.height - this.position.y;

                        this.velocity.y = 0;
                        this.position.y = block.hitbox.position.y - offset - 0.01;
                        break;
                    }
                    // check collision for triangle up right
                    else if (
                        block.direction.y == "up" &&
                        this.hitbox.legs.position.x >= block.hitbox.position.x &&
                        this.hitbox.legs.position.x < block.hitbox.position.x + block.hitbox.width
                    ) {
                        let xPos = this.calculateXPos(block);

                        this.triangleChangePosition(block, xPos);
                        break;
                    }

                    //check collision for triangle down right
                    else if (
                        block.direction.y == "down" &&
                        this.velocity.y < 0 &&
                        this.hitbox.position.x < block.hitbox.position.x &&
                        this.hitbox.position.x + this.hitbox.width >= block.hitbox.position.x &&
                        this.hitbox.position.y < block.hitbox.position.y + block.hitbox.height &&
                        this.hitbox.position.y > block.hitbox.position.y
                    ) {
                        this.velocity.y = 0;
                        const offset = this.hitbox.position.y - this.position.y;
                        this.position.y =
                            block.hitbox.position.y + block.hitbox.height - offset + 0.01;
                        break;
                    }

                    //check collision for triangle down right
                    else if (
                        block.direction.y == "down" &&
                        this.velocity.y < 0 &&
                        this.hitbox.position.x < block.hitbox.position.x + block.hitbox.width &&
                        this.hitbox.position.y > block.hitbox.position.y
                    ) {
                        let xPos = this.calculateXPos(block);

                        this.triangleChangePosition(block, xPos);
                        break;
                    }
                    //player going down to triangle down
                    else if (
                        block.direction.y == "down" &&
                        this.velocity.y >= 0 &&
                        this.hitbox.legs.position.x <
                            block.hitbox.position.x + block.hitbox.width &&
                        this.hitbox.legs.position.x + this.hitbox.legs.width >
                            block.hitbox.position.x &&
                        this.hitbox.position.y + this.hitbox.height >= block.hitbox.position.y &&
                        this.hitbox.position.y + this.hitbox.height <=
                            block.hitbox.position.y + block.hitbox.height
                    ) {
                        this.isOnBlock = true;
                        const offset =
                            this.hitbox.position.y + this.hitbox.height - this.position.y;

                        this.velocity.y = 0;
                        this.position.y = block.hitbox.position.y - offset - 0.01;
                        break;
                    }
                    //player going down head collision
                    else if (
                        this.velocity.y > 0 &&
                        this.hitbox.position.y + this.hitbox.height - this.hitbox.legs.height >=
                            block.hitbox.position.y &&
                        this.hitbox.legs.position.x + this.hitbox.legs.width <
                            block.hitbox.position.x
                    ) {
                        this.position.x -= 3;
                        this.sliding.left = true;
                        break;
                    }
                    //player going down head collision
                    else if (block.direction.y == "up" && this.velocity.y > 0) {
                        let myBlock = {
                            direction: {
                                x: block.direction.x,
                                y: "down",
                            },
                        };
                        let xPos = this.calculateXPos(myBlock);
                        if (
                            this.hitbox.position.y + this.hitbox.height - this.hitbox.legs.height >=
                            block.hitbox.position.y + xPos
                        ) {
                            this.position.x++;
                            this.sliding.right = true;
                            break;
                        }
                    }
                    if (
                        block.shape == "pondTriangle" &&
                        this.velocity.y > 0 &&
                        this.hitbox.legs.position.x + this.hitbox.legs.width >=
                            block.hitbox.position.x &&
                        this.hitbox.legs.position.x + this.hitbox.legs.width <=
                            block.hitbox.position.x + block.hitbox.width
                    ) {
                        this.isOnBlock = true;
                        const offset =
                            this.hitbox.position.y + this.hitbox.height - this.position.y;

                        this.velocity.y = 0;
                        this.position.y = block.hitbox.position.y - offset - 0.01;
                        break;
                    }
                }
                //collision for pond
                else if (block.shape == "pond") {
                    //check pond
                    if (
                        this.element != block.element &&
                        this.hitbox.position.y + this.hitbox.height >=
                            block.hitbox.position.y + 10 &&
                        this.hitbox.position.y + this.hitbox.height <=
                            block.hitbox.position.y + block.hitbox.height
                    ) {
                        //end
                        this.died = true;
                        break;
                    }

                    //player going down
                    if (
                        this.hitbox.legs.position.x <=
                            block.hitbox.position.x + block.hitbox.width &&
                        this.hitbox.legs.position.x >= block.hitbox.position.x &&
                        this.hitbox.position.y + this.hitbox.height >=
                            block.hitbox.position.y + block.hitbox.height / 2 &&
                        this.hitbox.position.y + this.hitbox.height <=
                            block.hitbox.position.y + block.hitbox.height &&
                        !(
                            blocks[i + 1].shape == "pondTriangle" &&
                            this.hitbox.legs.position.x + this.hitbox.legs.width >
                                blocks[i + 1].hitbox.position.x
                        )
                    ) {
                        this.isOnBlock = true;
                        this.velocity.y = 0;
                        const offset =
                            this.hitbox.position.y + this.hitbox.height - this.position.y;

                        this.position.y =
                            block.hitbox.position.y - offset - 0.01 + block.hitbox.height / 2;
                        break;
                    }
                    //player going up
                    else if (
                        this.hitbox.position.x <= block.hitbox.position.x + block.hitbox.width &&
                        this.hitbox.position.x >= block.hitbox.position.x &&
                        this.hitbox.position.y >=
                            block.hitbox.position.y + block.hitbox.height / 2 &&
                        this.hitbox.position.y <= block.hitbox.position.y + block.hitbox.height
                    ) {
                        this.velocity.y = 0;
                        const offset = this.hitbox.position.y - this.position.y;
                        this.position.y =
                            block.hitbox.position.y + block.hitbox.height - offset + 0.01;
                        break;
                    }
                }
            }
        }
    }
}
