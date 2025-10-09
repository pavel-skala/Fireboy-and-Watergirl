import { ctx } from "./helpers.js";

export class Sprite {
    constructor({
        position,
        imgSrc,
        animations,
        flipImage = false,
        frameRate = 1,
        imgRows = 1,
        currentRow = 1,
        frameDelay = 4,
        shape,
        angle = null,
    }) {
        this.position = position;
        this.image = new Image();
        this.image.src = imgSrc;
        this.image.onload = () => {
            this.loaded = true;
            this.width = this.image.width;
            this.height = this.image.height / imgRows;
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
        this.angle = angle;
        this.shape = shape;

        this.opacity = 1;
    }
    draw() {
        if (this.loaded) {
            const cropBox = {
                position: {
                    x: (this.width / this.frameRate) * this.currentFrame,
                    y: this.height * (this.currentRow - 1),
                },
                width: this.width / this.frameRate,
                height: this.height,
            };

            ctx.globalAlpha = this.opacity;

            //run animations
            if (
                this.currentAnimation == "left" ||
                this.currentAnimation == "right" ||
                this.shape == "lever" ||
                (this.shape == "ramp" && this.angle) ||
                this.shape == "ball"
            ) {
                ctx.save();
                if (this.shape == "lever") {
                    ctx.translate(this.position.x + cropBox.width / 2, this.centerPoint.y);
                    ctx.rotate(this.angle);
                    ctx.translate(-(this.position.x + cropBox.width / 2), -this.centerPoint.y);
                    ctx.drawImage(
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
                } else if (this.flipImage) {
                    ctx.translate(
                        this.position.x + cropBox.width / 2,
                        this.position.y + cropBox.height / 2
                    );
                    ctx.rotate(-this.angle);
                    ctx.translate(
                        -(this.position.x + cropBox.width / 2),
                        -(this.position.y + cropBox.height / 2)
                    );
                    ctx.scale(-1, 1);
                    ctx.drawImage(
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
                    ctx.translate(
                        this.position.x + cropBox.width / 2,
                        this.position.y + cropBox.height / 2
                    );
                    ctx.rotate(this.angle);
                    ctx.translate(
                        -(this.position.x + cropBox.width / 2),
                        -(this.position.y + cropBox.height / 2)
                    );
                    ctx.drawImage(
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
                ctx.restore();
            }
            //flipped images
            else if (this.flipImage) {
                ctx.save();
                ctx.scale(-1, 1);
                ctx.drawImage(
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
                ctx.restore();

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
                ctx.drawImage(
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

            ctx.globalAlpha = 1;

            this.frameCount++;
            if (this.frameCount == this.frameDelay) {
                if (this.constructor.name == "Door") {
                    this.openDoor();
                    this.frameCount = 0;
                    return;
                }

                this.currentFrame++;

                if (this.currentFrame == this.frameRate) {
                    this.currentFrame = 0;
                }
                this.frameCount = 0;
            }
        }
    }
}
