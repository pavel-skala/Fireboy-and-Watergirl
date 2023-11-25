class Player extends Sprite {
    constructor({ collisionBlocks, position, imgSrc, legs }) {
        super({ position, imgSrc });
        this.position = position;
        this.velocity = {
            x: 0,
            y: 0,
        };

        // this.height = 70;
        // this.width = 36;

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
        };

        this.legs = legs;
    }
    update() {
        this.hitboxPositionCalc();
        this.lastPosition = this.hitbox.position;
        c.fillStyle = "rgba(0,0,255,0.5)";
        c.fillRect(
            this.hitbox.position.x,
            this.hitbox.position.y,
            this.hitbox.width,
            this.hitbox.height
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
                    //player going to left
                    if (this.velocity.x < 0) {
                        const offset = this.hitbox.position.x - this.position.x;
                        this.position.x =
                            collisionBlock.position.x + collisionBlock.width - offset + 0.01;
                        break;
                    }
                    //player going to right
                    if (this.velocity.x > 0) {
                        const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;
                        this.position.x = collisionBlock.position.x - offset - 0.01;
                        break;
                    }
                }
                //triangle collision
                else if (collisionBlock.shape == "triangle") {
                    if (collisionBlock.direction.y == "up" && this.isOnBlock == false) {
                        let xPos = this.calculateXPos(collisionBlock);
                        if (
                            this.hitbox.position.y + this.hitbox.height - this.velocity.y >=
                            collisionBlock.position.y + xPos
                        ) {
                            //triangle to right
                            if (
                                collisionBlock.direction.x == "right" &&
                                this.lastPosition.x >=
                                    collisionBlock.position.x + collisionBlock.width
                            ) {
                                const offset = this.hitbox.position.x - this.position.x;
                                this.position.x =
                                    collisionBlock.position.x +
                                    collisionBlock.width -
                                    offset +
                                    0.01;
                                break;
                            }
                            //triangle to left
                            else if (
                                collisionBlock.direction.x == "left" &&
                                this.lastPositionX <= collisionBlock.position.x
                            ) {
                                const offset =
                                    this.hitbox.position.x - this.position.x + this.hitbox.width;
                                this.position.x = collisionBlock.position.x - offset - 0.01;
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
        let xPos = this.hitbox.position.x % 36;
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
        //for triangle up
        if (
            collisionBlock.direction.y == "up" &&
            this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y + xPos
        ) {
            this.isOnBlock = true;
            this.velocity.y = 0;
            const offset = this.hitbox.position.y + this.hitbox.height - this.position.y;
            this.position.y = collisionBlock.position.y + xPos - offset - 0.01;
        }
        //for triangle down
        else if (
            collisionBlock.direction.y == "down" &&
            this.hitbox.position.y < collisionBlock.position.y + collisionBlock.height - xPos
        ) {
            this.velocity.y = 0;
            const offset = this.hitbox.position.y - this.position.y;
            this.position.y =
                collisionBlock.position.y + collisionBlock.height - xPos - offset + 0.01;
        }
    }
    verticalCollision() {
        this.isOnBlock = false;

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
                    //player going up
                    if (this.velocity.y < 0) {
                        this.velocity.y = 0;
                        const offset = this.hitbox.position.y - this.position.y;
                        this.position.y =
                            collisionBlock.position.y + collisionBlock.height - offset + 0.01;
                        break;
                    }
                    //player going down
                    if (this.velocity.y > 0) {
                        this.isOnBlock = true;
                        this.velocity.y = 0;
                        const offset =
                            this.hitbox.position.y + this.hitbox.height - this.position.y;
                        this.position.y = collisionBlock.position.y - offset - 0.01;
                        break;
                    }
                }
                //collision for triangle left
                else if (collisionBlock.direction.x == "left") {
                    //check collision for triangle up left
                    if (
                        this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
                        this.hitbox.position.x + this.hitbox.width <=
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
                    //player going down
                    if (
                        this.hitbox.position.x <=
                            collisionBlock.position.x + collisionBlock.width &&
                        this.hitbox.position.x >= collisionBlock.position.x &&
                        this.hitbox.position.y + this.hitbox.height >=
                            collisionBlock.position.y + collisionBlock.height / 2 &&
                        this.hitbox.position.y + this.hitbox.height <=
                            collisionBlock.position.y + collisionBlock.height &&
                        this.collisionBlocks[i + 1].shape != "pondTriangle"
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
                        this.position.x <= collisionBlock.position.x + collisionBlock.width &&
                        this.position.x >= collisionBlock.position.x &&
                        this.position.y >= collisionBlock.position.y + collisionBlock.height / 2 &&
                        this.position.y <= collisionBlock.position.y + collisionBlock.height
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
