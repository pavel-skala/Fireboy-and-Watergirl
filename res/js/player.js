class Player {
    constructor({ collisionBlocks = [] }) {
        this.position = {
            x: 100,
            y: 100,
        };
        this.velocity = {
            x: 0,
            y: 0,
        };

        this.height = 36;
        this.width = 36;

        this.collisionBlocks = collisionBlocks;
        console.log(this.collisionBlocks);
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
        console.log(this.position.y + this.height);
    }
    horizontalCollision() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i];

            if (
                this.position.x <=
                    collisionBlock.position.x + collisionBlock.width &&
                this.position.x + this.width >= collisionBlock.position.x &&
                this.position.y + this.height >= collisionBlock.position.y &&
                this.position.y <=
                    collisionBlock.position.y + collisionBlock.height
            ) {
                //player going to left
                if (this.velocity.x < 0) {
                    this.position.x =
                        collisionBlock.position.x + collisionBlock.width + 0.01;
                    break;
                }
                //player going to right
                if (this.velocity.x > 0) {
                    this.position.x =
                        collisionBlock.position.x - this.width - 0.01;
                    break;
                }
            }
        }
    }
    verticalCollision() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i];

            if (
                this.position.x <=
                    collisionBlock.position.x + collisionBlock.width &&
                this.position.x + this.width >= collisionBlock.position.x &&
                this.position.y + this.height >= collisionBlock.position.y &&
                this.position.y <=
                    collisionBlock.position.y + collisionBlock.height
            ) {
                //player going up
                if (this.velocity.y < 0) {
                    this.velocity.y = 0;
                    this.position.y =
                        collisionBlock.position.y +
                        collisionBlock.height +
                        0.01;
                    break;
                }
                //player going down
                if (this.velocity.y > 0) {
                    this.velocity.y = 0;
                    this.position.y =
                        collisionBlock.position.y - this.height - 0.01;
                    break;
                }
            }
        }
    }
}
