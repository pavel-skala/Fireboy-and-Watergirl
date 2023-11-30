class Player extends Sprite {
    constructor({ collisionBlocks, position, imgSrc, legs }) {
        super({ position, imgSrc });
        this.position = position;
        this.velocity = {
            x: 0,
            y: 0,
        };

        this.collisionBlocks = collisionBlocks;
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
    }
    update() {
        this.hitboxPositionCalc();
        this.lastPosition = this.hitbox.position;

        c.fillStyle = "rgba(0,0,255,0.5)";
        c.fillRect(
            this.hitbox.position.x,
            this.hitbox.position.y,
            this.hitbox.width,
            this.hitbox.height - this.hitbox.legs.height
        );
        c.fillStyle = "rgba(0,255,0, 0.5)";
        c.fillRect(
            this.hitbox.legs.position.x,
            this.hitbox.legs.position.y,
            this.hitbox.legs.width,
            this.hitbox.legs.height
        );

        this.position.x += this.velocity.x;

        this.hitboxPositionCalc();
        this.horizontalCollision();

        //gravity
        this.gravity();

        this.hitboxPositionCalc();
        this.verticalCollision();

        this.legs.position = {
            x: this.position.x + 10,
            y: this.position.y + 47,
        };
    }
    hitboxPositionCalc() {
        this.hitbox.position = {
            x: this.position.x + 4,
            y: this.position.y + 12,
        };
        this.hitbox.legs.position = {
            x: this.hitbox.position.x + (this.hitbox.width - this.hitbox.legs.width) / 2,
            y: this.hitbox.position.y + this.hitbox.height - this.hitbox.legs.height,
        };
    }
    gravity() {
        this.velocity.y++;
        this.position.y += this.velocity.y;
    }
    horizontalCollision() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i];

            if (
                this.hitbox.position.x <= collisionBlock.position.x + collisionBlock.width &&
                this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
                this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y &&
                this.hitbox.position.y <= collisionBlock.position.y + collisionBlock.height
            ) {
                if (collisionBlock.shape == "square") {
                    //head collision
                    if (
                        this.hitbox.position.y + this.hitbox.height - this.hitbox.legs.height >=
                            collisionBlock.position.y &&
                        this.hitbox.position.y <=
                            collisionBlock.position.y + collisionBlock.height &&
                        !this.sliding.right &&
                        !this.sliding.left
                    ) {
                        //player going to left
                        if (this.velocity.x < 0) {
                            const offset = this.hitbox.position.x - this.position.x;
                            this.position.x =
                                collisionBlock.position.x + collisionBlock.width - offset + 0.01;
                            break;
                        }
                        //player going to right
                        else if (this.velocity.x > 0) {
                            const offset =
                                this.hitbox.position.x - this.position.x + this.hitbox.width;
                            this.position.x = collisionBlock.position.x - offset - 0.01;
                            break;
                        }
                    }
                    //player sliding
                    else if (this.sliding.left) this.position.x--;
                    else if (this.sliding.right) this.position.x++;
                    //legs collision
                    else if (
                        this.hitbox.legs.position.y + this.hitbox.legs.height >=
                            collisionBlock.position.y &&
                        this.hitbox.legs.position.y <=
                            collisionBlock.position.y + collisionBlock.height
                    ) {
                        //player going to left
                        if (
                            this.velocity.x < 0 &&
                            this.hitbox.legs.position.x <=
                                collisionBlock.position.x + collisionBlock.width &&
                            this.hitbox.legs.position.x + this.hitbox.legs.width >=
                                collisionBlock.position.x
                        ) {
                            const offset = this.hitbox.legs.position.x - this.position.x;
                            this.position.x =
                                collisionBlock.position.x + collisionBlock.width - offset + 0.01;
                            break;
                        }
                        //player going to right
                        else if (
                            this.velocity.x > 0 &&
                            this.hitbox.legs.position.x + this.hitbox.legs.width >=
                                collisionBlock.position.x &&
                            this.hitbox.legs.position.x <= collisionBlock.position.x
                        ) {
                            const offset =
                                this.hitbox.legs.position.x -
                                this.position.x +
                                this.hitbox.legs.width;
                            this.position.x = collisionBlock.position.x - offset - 0.01;
                            break;
                        }
                    }
                }
                //triangle collision
                else if (
                    collisionBlock.shape == "triangle" &&
                    collisionBlock.direction.y == "up" &&
                    this.isOnBlock == false
                ) {
                    //head collision
                    if (
                        this.hitbox.position.y + this.hitbox.height - this.hitbox.legs.height >=
                            collisionBlock.position.y + collisionBlock.height &&
                        this.hitbox.position.y <=
                            collisionBlock.position.y + collisionBlock.height &&
                        !this.sliding.left &&
                        !this.sliding.right
                    ) {
                        //player going to left
                        if (this.velocity.x < 0) {
                            const offset = this.hitbox.position.x - this.position.x;
                            this.position.x =
                                collisionBlock.position.x + collisionBlock.width - offset + 0.01;
                            break;
                        }
                        //player going to right
                        else if (this.velocity.x > 0) {
                            const offset =
                                this.hitbox.position.x - this.position.x + this.hitbox.width;
                            this.position.x = collisionBlock.position.x - offset - 0.01;
                            break;
                        }
                    }
                    //player sliding
                    else if (this.sliding.left) this.position.x--;
                    else if (this.sliding.right) this.position.x++;
                    //legs collision
                    else if (
                        this.hitbox.legs.position.y + this.hitbox.legs.height >=
                            collisionBlock.position.y + collisionBlock.height &&
                        this.hitbox.legs.position.y <=
                            collisionBlock.position.y + collisionBlock.height
                    ) {
                        //triangle left
                        if (
                            collisionBlock.direction.x == "right" &&
                            this.hitbox.legs.position.x <=
                                collisionBlock.position.x + collisionBlock.width &&
                            this.lastPosition.x +
                                (this.hitbox.width - this.hitbox.legs.width) / 2 >=
                                collisionBlock.position.x + collisionBlock.width
                        ) {
                            const offset = this.hitbox.legs.position.x - this.position.x;
                            this.position.x =
                                collisionBlock.position.x + collisionBlock.width - offset + 0.01;
                            break;
                        }
                        //triangle right
                        else if (
                            collisionBlock.direction.x == "left" &&
                            this.hitbox.legs.position.x + this.hitbox.legs.width >=
                                collisionBlock.position.x &&
                            this.lastPosition.x +
                                (this.hitbox.width - this.hitbox.legs.width) / 2 +
                                this.hitbox.legs.width <=
                                collisionBlock.position.x
                        ) {
                            const offset =
                                this.hitbox.legs.position.x -
                                this.position.x +
                                this.hitbox.legs.width;
                            this.position.x = collisionBlock.position.x - offset - 0.01;
                            break;
                        }
                    }
                }
            }
        }
    }
    //calculate XPosition in square 36*36
    calculateXPos(collisionBlock) {
        let xPos;
        //triangle up
        if (collisionBlock.direction.y == "up") {
            xPos = this.hitbox.legs.position.x % 36;
            //triangle to left
            if (collisionBlock.direction.x == "left") {
                xPos = (this.hitbox.legs.position.x + this.hitbox.legs.width) % 36;

                xPos = 36 - xPos;
                if (xPos == 36 || xPos < 1) xPos = 0;
            }
            //triangle to right
            else {
                if (xPos == 0) xPos = 36;
                else if (xPos < 1) xPos = 0;
            }
            if (collisionBlock.shape == "pondTriangle") xPos /= 2;
        }
        //triangle down
        else {
            xPos = this.hitbox.position.x % 36;

            if (collisionBlock.direction.x == "left") xPos = 36 - xPos;
            else {
                if (xPos == 0) xPos = 36;
                else if (xPos < 1) xPos = 0;
            }
        }
        return xPos;
    }
    //change position for collision in triangle
    triangleChangePosition(collisionBlock, xPos) {
        //for triangle up
        if (
            collisionBlock.direction.y == "up" &&
            this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y + xPos
        ) {
            this.isOnBlock = true;
            this.velocity.y = 0;
            const offset = this.hitbox.position.y + this.hitbox.height - this.position.y;
            this.position.y = collisionBlock.position.y + xPos - offset - 0.01;
            if (collisionBlock.shape == "triangle") {
                if (collisionBlock.direction.x == "left") this.position.x -= 0.5;
                else this.position.x += 0.5;
            }
        }
        //for triangle down
        else if (
            collisionBlock.direction.y == "down" &&
            this.hitbox.position.y < collisionBlock.position.y + collisionBlock.height - xPos
        ) {
            const offset = this.hitbox.position.y - this.position.y;
            this.position.y =
                collisionBlock.position.y + collisionBlock.height - xPos - offset + 0.01;
            this.velocity.y = 0;
        }
    }
    verticalCollision() {
        this.isOnBlock = false;
        this.sliding.right = false;
        this.sliding.left = false;

        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i];

            if (
                this.hitbox.position.x <= collisionBlock.position.x + collisionBlock.width &&
                this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
                this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y &&
                this.hitbox.position.y <= collisionBlock.position.y + collisionBlock.height
            ) {
                //collision for square
                if (collisionBlock.shape == "square") {
                    //player going down legs collision
                    if (
                        this.velocity.y > 0 &&
                        this.hitbox.legs.position.x <
                            collisionBlock.position.x + collisionBlock.width &&
                        this.hitbox.legs.position.x + this.hitbox.legs.width >
                            collisionBlock.position.x
                    ) {
                        this.isOnBlock = true;
                        const offset =
                            this.hitbox.position.y + this.hitbox.height - this.position.y;

                        this.velocity.y = 0;
                        this.position.y = collisionBlock.position.y - offset - 0.01;
                        break;
                    }
                    //player going down head collision
                    else if (
                        this.velocity.y > 0 &&
                        this.hitbox.position.y + this.hitbox.height - this.hitbox.legs.height >=
                            collisionBlock.position.y
                    ) {
                        //player going left
                        if (this.hitbox.position.x <= collisionBlock.position.x) {
                            this.position.x--;
                            this.sliding.left = true;
                        }
                        //player going right
                        else {
                            this.position.x++;
                            this.sliding.right = true;
                        }
                        break;
                    }
                    //player going up
                    else if (
                        this.velocity.y < 0 &&
                        this.hitbox.position.y <=
                            collisionBlock.position.y + collisionBlock.height &&
                        this.hitbox.position.y >= collisionBlock.position.y
                    ) {
                        this.velocity.y = 0;
                        const offset = this.hitbox.position.y - this.position.y;
                        this.position.y =
                            collisionBlock.position.y + collisionBlock.height - offset + 0.01;
                        break;
                    }
                }
                //collision for triangle left
                else if (collisionBlock.direction.x == "left") {
                    //player going from down to triangle
                    if (
                        collisionBlock.direction.y == "up" &&
                        this.lastPosition.y >= collisionBlock.position.y + collisionBlock.height
                    ) {
                        const offset = this.hitbox.position.y - this.position.y;
                        this.velocity.y = 0;
                        this.position.y =
                            collisionBlock.position.y + collisionBlock.height - offset + 0.01;
                        break;
                    }
                    //check collision for triangle up left
                    else if (
                        this.hitbox.legs.position.x + this.hitbox.legs.width >
                            collisionBlock.position.x &&
                        this.hitbox.legs.position.x + this.hitbox.legs.width <=
                            collisionBlock.position.x + collisionBlock.width &&
                        collisionBlock.direction.y == "up"
                    ) {
                        let xPos = this.calculateXPos(collisionBlock);

                        this.triangleChangePosition(collisionBlock, xPos);
                        break;
                    }
                    // check collision for triangle down left
                    else if (
                        this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
                        this.hitbox.position.x + this.hitbox.width <=
                            collisionBlock.position.x + collisionBlock.width &&
                        collisionBlock.direction.y == "down" &&
                        this.velocity.y < 0
                    ) {
                        let xPos = this.calculateXPos(collisionBlock);
                        this.triangleChangePosition(collisionBlock, xPos);
                        break;
                    }
                    //player going down head collision
                    else if (collisionBlock.direction.y == "up" && this.velocity.y > 0) {
                        let block = {
                            direction: {
                                x: collisionBlock.direction.x,
                                y: "down",
                            },
                        };
                        let xPos = this.calculateXPos(block);
                        if (
                            this.hitbox.position.y + this.hitbox.height - this.hitbox.legs.height >=
                            collisionBlock.position.y + xPos
                        ) {
                            this.position.x--;
                            this.sliding.left = true;
                            break;
                        }
                    }
                }
                //collision for triangle right
                else if (collisionBlock.direction.x == "right") {
                    //player going from down to triangle
                    if (
                        collisionBlock.direction.y == "up" &&
                        this.lastPosition.y >= collisionBlock.position.y + collisionBlock.height
                    ) {
                        const offset = this.hitbox.position.y - this.position.y;
                        this.velocity.y = 0;
                        this.position.y =
                            collisionBlock.position.y + collisionBlock.height - offset + 0.01;
                        break;
                    }
                    // check collision for triangle up right
                    else if (
                        collisionBlock.direction.y == "up" &&
                        this.hitbox.legs.position.x >= collisionBlock.position.x &&
                        this.hitbox.legs.position.x <=
                            collisionBlock.position.x + collisionBlock.width
                    ) {
                        let xPos = this.calculateXPos(collisionBlock);

                        this.triangleChangePosition(collisionBlock, xPos);
                        break;
                    }

                    //check collision for triangle down right
                    else if (collisionBlock.direction.y == "down" && this.velocity.y < 0) {
                        let xPos = this.calculateXPos(collisionBlock);

                        this.triangleChangePosition(collisionBlock, xPos);
                        break;
                    }
                    //player going down head collision
                    else if (collisionBlock.direction.y == "up" && this.velocity.y > 0) {
                        let block = {
                            direction: {
                                x: collisionBlock.direction.x,
                                y: "down",
                            },
                        };
                        let xPos = this.calculateXPos(block);
                        if (
                            this.hitbox.position.y + this.hitbox.height - this.hitbox.legs.height >=
                            collisionBlock.position.y + xPos
                        ) {
                            this.position.x++;
                            this.sliding.right = true;
                            break;
                        }
                    }
                }
                //collision for pond
                else if (collisionBlock.shape == "pond") {
                    //player going down
                    if (
                        this.hitbox.legs.position.x <=
                            collisionBlock.position.x + collisionBlock.width &&
                        this.hitbox.legs.position.x >= collisionBlock.position.x &&
                        this.hitbox.position.y + this.hitbox.height >=
                            collisionBlock.position.y + collisionBlock.height / 2 &&
                        this.hitbox.position.y + this.hitbox.height <=
                            collisionBlock.position.y + collisionBlock.height &&
                        !(
                            this.collisionBlocks[i + 1].shape == "pondTriangle" &&
                            this.hitbox.legs.position.x + this.hitbox.legs.width >
                                this.collisionBlocks[i + 1].position.x
                        )
                    ) {
                        this.isOnBlock = true;
                        this.velocity.y = 0;
                        const offset =
                            this.hitbox.position.y + this.hitbox.height - this.position.y;

                        this.position.y =
                            collisionBlock.position.y - offset - 0.01 + collisionBlock.height / 2;
                        break;
                    }
                    //player going up
                    else if (
                        this.hitbox.position.x <=
                            collisionBlock.position.x + collisionBlock.width &&
                        this.hitbox.position.x >= collisionBlock.position.x &&
                        this.hitbox.position.y >=
                            collisionBlock.position.y + collisionBlock.height / 2 &&
                        this.hitbox.position.y <= collisionBlock.position.y + collisionBlock.height
                    ) {
                        this.velocity.y = 0;
                        const offset = this.hitbox.position.y - this.position.y;
                        this.position.y =
                            collisionBlock.position.y + collisionBlock.height - offset + 0.01;
                        break;
                    }
                }
            }
        }
    }
}
