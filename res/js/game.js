function playGame(levelNumber) {
    const [collisionBlocks, ponds] = createObjectsFromArray(collisionsLevel1);

    const map = new Sprite({
        position: {
            x: 0,
            y: 0,
        },
        imgSrc: `./res/img/maps/map${levelNumber}.png`,
    });

    const player = new Player({
        collisionBlocks: collisionBlocks,
        position: {
            x: 900,
            y: 1000,
        },
        imgSrc: "./res/img/watergirl_sprite.png",
        keys: {
            up: "w",
            left: "a",
            right: "d",
            pressed: {
                up: false,
                left: false,
                right: false,
            },
        },
        frameRate: 1,
        frameDelay: 4,
        imgRows: 2,
        currentRow: 1,
        animations: {
            idle: {
                currentRow: 1,
                frameRate: 1,
            },
            runLeft: {
                currentRow: 2,
                frameRate: 8,
                flipImage: true,
            },
            runRight: {
                currentRow: 2,
                frameRate: 8,
            },
        },
        element: "water",

        legs: new Sprite({
            position: {
                x: 900,
                y: 1000,
            },
            imgSrc: "./res/img/watergirl_legs_sprite.png",
            imgRows: 2,
            currentRow: 1,
            frameRate: 1,
            frameDelay: 4,
            animations: {
                idle: {
                    currentRow: 1,
                    frameRate: 1,
                },
                runLeft: {
                    currentRow: 2,
                    flipImage: true,
                    frameRate: 8,
                },
                runRight: {
                    currentRow: 2,
                    frameRate: 8,
                },
            },
        }),
    });

    let now;
    let delta;
    let fixedFps = 60;
    let interval = 1000 / fixedFps;
    let then = Date.now();

    function animation() {
        now = Date.now();
        delta = now - then;

        if (delta > interval) {
            then = now - (delta % interval);

            map.draw();
            collisionBlocks.forEach((collisionBlock) => {
                collisionBlock.draw();
            });

            if (player.keys.pressed.left) {
                player.velocity.x = -4;
                player.changeSprite("runLeft");
            } else if (player.keys.pressed.right) {
                player.velocity.x = 4;
                player.changeSprite("runRight");
            } else {
                player.velocity.x = 0;
                player.changeSprite("idle");
            }

            player.legs.draw();
            player.draw();
            player.update();

            ponds.forEach((pond) => {
                pond.draw();
            });

            if (player.died) {
                return;
            }
        }
        requestAnimationFrame(animation);
    }
    animation();

    window.addEventListener("keydown", (event) => {
        switch (event.key) {
            case player.keys.up:
                if (player.isOnBlock && !player.keys.pressed.up) {
                    player.velocity.y = -10;
                    player.keys.pressed.up = true;
                }
                break;
            case player.keys.left:
                player.keys.pressed.left = true;
                break;
            case player.keys.right:
                player.keys.pressed.right = true;
                break;
        }
    });

    window.addEventListener("keyup", (event) => {
        switch (event.key) {
            case player.keys.up:
                player.keys.pressed.up = false;
                break;
            case player.keys.left:
                player.keys.pressed.left = false;
                break;
            case player.keys.right:
                player.keys.pressed.right = false;
                break;
        }
    });
}
