class Sprite {
    constructor({
        position,
        imgSrc,
        animations,
        flipImage = false,
        frameRate = 1,
        imgRows = 1,
        currentRow = 1,
        frameDelay = 4,
    }) {
        this.position = position;
        this.image = new Image();
        this.image.src = imgSrc;
        this.image.onload = () => {
            this.loaded = true;
            this.width = this.image.width;
            this.height = this.image.height;
        };
        this.loaded = false;

        this.frameRate = frameRate;
        this.frameDelay = frameDelay;
        this.imgRows = imgRows;
        this.currentRow = currentRow;

        this.currentFrame = 0;
        this.frameCount = 0;

        this.flipImage = flipImage;
        if (this.flipImage) {
            this.currentFrame = frameRate - 1;
        }

        this.animations = animations;
        this.angle = null;
    }
    draw() {
        if (this.loaded) {
            const cropBox = {
                position: {
                    x: (this.width / this.frameRate) * this.currentFrame,
                    y: (this.height / this.imgRows) * (this.currentRow - 1),
                },
                width: this.width / this.frameRate,
                height: this.height / this.imgRows,
            };

            //run animations
            if (this.animations && this.currentAnimation != "idle") {
                c.save();
                if (this.flipImage) {
                    c.translate(
                        this.position.x + cropBox.width / 2,
                        this.position.y + cropBox.height / 2
                    );
                    c.rotate(-this.angle);
                    c.translate(
                        -(this.position.x + cropBox.width / 2),
                        -(this.position.y + cropBox.height / 2)
                    );
                    c.scale(-1, 1);
                    c.drawImage(
                        this.image,
                        cropBox.position.x,
                        cropBox.position.y,
                        cropBox.width,
                        cropBox.height,
                        cropBox.width * -1 - this.position.x,
                        this.position.y,
                        cropBox.width,
                        cropBox.height
                    );
                } else {
                    c.translate(
                        this.position.x + cropBox.width / 2,
                        this.position.y + cropBox.height / 2
                    );
                    c.rotate(this.angle);
                    c.translate(
                        -(this.position.x + cropBox.width / 2),
                        -(this.position.y + cropBox.height / 2)
                    );
                    c.drawImage(
                        this.image,
                        cropBox.position.x,
                        cropBox.position.y,
                        cropBox.width,
                        cropBox.height,
                        this.position.x,
                        this.position.y,
                        cropBox.width,
                        cropBox.height
                    );
                }
                c.restore();
            }

            //flipped images
            else if (this.flipImage) {
                c.save();
                c.scale(-1, 1);
                c.drawImage(
                    this.image,
                    cropBox.position.x,
                    cropBox.position.y,
                    cropBox.width,
                    cropBox.height,
                    cropBox.width * -1 - this.position.x,
                    this.position.y,
                    cropBox.width,
                    cropBox.height
                );
                c.restore();

                this.frameCount++;
                if (this.frameCount == this.frameDelay) {
                    this.currentFrame--;

                    if (this.currentFrame < 0) {
                        this.currentFrame = this.frameRate - 1;
                    }
                    this.frameCount = 0;
                }
                return;
            } else {
                c.drawImage(
                    this.image,
                    cropBox.position.x,
                    cropBox.position.y,
                    cropBox.width,
                    cropBox.height,
                    this.position.x,
                    this.position.y,
                    cropBox.width,
                    cropBox.height
                );
            }

            this.frameCount++;
            if (this.frameCount == this.frameDelay) {
                this.currentFrame++;

                if (this.currentFrame == this.frameRate) {
                    this.currentFrame = 0;
                }
                this.frameCount = 0;
            }
        }
    }
}
