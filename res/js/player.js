class Player {
    constructor({ collisionBlocks, position }) {
        this.position = position;
        this.velocity = {
            x: 0,
            y: 0,
        };

        this.height = 70;
        this.width = 36;

        this.collisionBlocks = collisionBlocks;
        this.isOnBlock = false;

        this.lastPositionX = 0;
    }
    update() {
        c.fillStyle = "rgb(0,0,255)";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
        this.position.x += this.velocity.x;

        this.horizontalCollision();

        //gravity
        this.velocity.y++;
        this.position.y += this.velocity.y;

        this.verticalCollision();

        this.lastPositionX = this.position.x;
    }
    horizontalCollision() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i];

            if (
                this.position.x <= collisionBlock.position.x + collisionBlock.width &&
                this.position.x + this.width >= collisionBlock.position.x &&
                this.position.y + this.height >= collisionBlock.position.y &&
                this.position.y <= collisionBlock.position.y + collisionBlock.height
            ) {
                if (collisionBlock.shape == "square") {
                    //player going to left
                    if (this.velocity.x < 0) {
                        this.position.x = collisionBlock.position.x + collisionBlock.width + 0.01;
                        break;
                    }
                    //player going to right
                    if (this.velocity.x > 0) {
                        this.position.x = collisionBlock.position.x - this.width - 0.01;
                        break;
                    }
                }
                //triangle collision
                else if (collisionBlock.shape == "triangle") {
                    if (collisionBlock.direction.y == "up" && this.isOnBlock == false) {
                        let xPos = this.calculateXPos(collisionBlock);
                        if (this.position.y + this.height >= collisionBlock.position.y + xPos) {
                            //triangle to right
                            if (
                                collisionBlock.direction.x == "right" &&
                                this.lastPositionX >=
                                    collisionBlock.position.x + collisionBlock.width
                            ) {
                                this.position.x =
                                    collisionBlock.position.x + collisionBlock.width + 0.01;
                                break;
                            }
                            //triangle to left
                            else if (
                                collisionBlock.direction.x == "left" &&
                                this.lastPositionX <= collisionBlock.position.x
                            ) {
                                this.position.x = collisionBlock.position.x - this.width - 0.01;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    //calculate XPosition in square 36*36
    calculateXPos(collisionBlock) {
        let xPos = this.position.x % 36;
        //triangle to left
        if (collisionBlock.direction.x == "left") {
            if (xPos > 35) xPos = 36;
            xPos = 36 - xPos;
        }
        //triangle to right
        else {
            if (xPos == 0) xPos = 36;
            else if (xPos < 1) xPos = 0;
        }
        if (collisionBlock.shape == "pondTriangle") xPos /= 2;
        return xPos;
    }
    //change position for collision in triangle
    triangleChangePosition(collisionBlock, xPos) {
        //triangle going up
        if (collisionBlock.direction.y == "up") {
            if (this.position.y + this.height >= collisionBlock.position.y + xPos) {
                if (this.velocity.y >= 0) {
                    this.isOnBlock = true;
                    this.position.y = collisionBlock.position.y + xPos - this.height - 0.01;
                    this.velocity.y = 0;
                } else {
                    this.velocity.y = 0;
                    this.position.y = collisionBlock.position.y + collisionBlock.height + 0.01;
                }
            }
        }
        //triangle going down
        else {
            if (this.position.y < collisionBlock.position.y + collisionBlock.height - xPos) {
                this.position.y = collisionBlock.position.y + collisionBlock.height - xPos + 0.01;
                this.velocity.y = 0;
            }
        }
    }
    verticalCollision() {
        this.isOnBlock = false;

        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i];

            if (
                this.position.x <= collisionBlock.position.x + collisionBlock.width &&
                this.position.x + this.width >= collisionBlock.position.x &&
                this.position.y + this.height >= collisionBlock.position.y &&
                this.position.y <= collisionBlock.position.y + collisionBlock.height
            ) {
                //collision for square
                if (collisionBlock.shape == "square") {
                    //player going up
                    if (this.velocity.y < 0) {
                        this.velocity.y = 0;
                        this.position.y = collisionBlock.position.y + collisionBlock.height + 0.01;
                        break;
                    }
                    //player going down
                    if (this.velocity.y > 0) {
                        this.isOnBlock = true;
                        this.velocity.y = 0;
                        this.position.y = collisionBlock.position.y - this.height - 0.01;
                        break;
                    }
                }
                //collision for triangle left
                else if (collisionBlock.direction.x == "left") {
                    //check collision for triangle up left
                    if (
                        this.position.x + this.width >= collisionBlock.position.x &&
                        this.position.x + this.width <=
                            collisionBlock.position.x + collisionBlock.width &&
                        collisionBlock.direction.y == "up"
                    ) {
                        this.isOnBlock = false;
                        let xPos = this.calculateXPos(collisionBlock);

                        this.triangleChangePosition(collisionBlock, xPos);
                        break;
                    }
                    // check collision for triangle down left
                    else if (
                        this.position.x + this.width >= collisionBlock.position.x &&
                        this.position.x + this.width <=
                            collisionBlock.position.x + collisionBlock.width &&
                        collisionBlock.direction.y == "down" &&
                        this.velocity.y < 0
                    ) {
                        let xPos = this.calculateXPos(collisionBlock);
                        this.triangleChangePosition(collisionBlock, xPos);
                        break;
                    }
                }
                //collision for triangle right
                else if (collisionBlock.direction.x == "right") {
                    // check collision for triangle up right
                    if (collisionBlock.direction.y == "up") {
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
                }
                //collision for pond
                else if (collisionBlock.shape == "pond") {
                    if (
                        this.position.x <= collisionBlock.position.x + collisionBlock.width &&
                        this.position.x >= collisionBlock.position.x &&
                        this.position.y + this.height >=
                            collisionBlock.position.y + collisionBlock.height / 2 &&
                        this.position.y + this.height <=
                            collisionBlock.position.y + collisionBlock.height
                    ) {
                        //player going down
                        if (this.velocity.y > 0) {
                            this.isOnBlock = true;
                            this.velocity.y = 0;
                            this.position.y =
                                collisionBlock.position.y -
                                this.height -
                                0.01 +
                                collisionBlock.height / 2;
                            if (this.collisionBlocks[i + 1].shape != "pondTriangle") {
                                break;
                            }
                        }
                    } else if (
                        this.position.x <= collisionBlock.position.x + collisionBlock.width &&
                        this.position.x >= collisionBlock.position.x &&
                        this.position.y >= collisionBlock.position.y + collisionBlock.height / 2 &&
                        this.position.y <= collisionBlock.position.y + collisionBlock.height
                    ) {
                        //player going up
                        if (this.velocity.y < 0) {
                            this.velocity.y = 0;
                            this.position.y =
                                collisionBlock.position.y + collisionBlock.height + 0.01;
                            break;
                        }
                    }
                }
            }
        }
    }
}
