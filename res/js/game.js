let pauseGame = false;
let menuActive = null;
let continueAnimation = false;
let menuButtonPressed = null;

function playGame(levelNumber) {
    let endGame = false;
    const [collisionBlocks, ponds] = createObjectsFromArray(collisionsLevel1);

    const map = new Sprite({
        position: {
            x: 0,
            y: 0,
        },
        imgSrc: `./res/img/maps/map${levelNumber}.png`,
    });

    const diamonds = [
        new Diamond({
            position: {
                x: 10 * 36,
                y: 2 * 36,
            },
            element: "fire",
        }),
        new Diamond({
            position: {
                x: 2 * 36,
                y: 5 * 36,
            },
            element: "water",
        }),
        new Diamond({
            position: {
                x: 18 * 36,
                y: 4 * 36,
            },
            element: "fire",
        }),
        new Diamond({
            position: {
                x: 22 * 36,
                y: 4 * 36,
            },
            element: "water",
        }),
        new Diamond({
            position: {
                x: 7 * 36,
                y: 13 * 36,
            },
            element: "fire",
        }),
        new Diamond({
            position: {
                x: 23 * 36,
                y: 14 * 36,
            },
            element: "water",
        }),
        new Diamond({
            position: {
                x: 20 * 36,
                y: 26 * 36,
            },
            element: "fire",
        }),
        new Diamond({
            position: {
                x: 28 * 36,
                y: 26 * 36,
            },
            element: "water",
        }),
    ];

    const players = [];

    //fireboy
    players.push(
        new Player({
            position: {
                x: 440,
                y: 500,
            },
            collisionBlocks,
            diamonds,
            imgSrc: "./res/img/fireboy_sprite.png",
            element: "fire",
            frameRate: 1,
            frameDelay: 4,
            imgRows: 4,
            currentRow: 1,
            keys: {
                up: "ArrowUp",
                left: "ArrowLeft",
                right: "ArrowRight",
                pressed: {
                    up: false,
                    left: false,
                    right: false,
                },
            },
            animations: {
                idle: {
                    currentRow: 1,
                    frameRate: 1,
                },
                left: {
                    currentRow: 2,
                    frameRate: 8,
                    flipImage: true,
                },
                right: {
                    currentRow: 2,
                    frameRate: 8,
                },
                up: {
                    currentRow: 3,
                    frameRate: 1,
                },
                down: {
                    currentRow: 4,
                    frameRate: 1,
                },
            },
            legs: new Sprite({
                position: {
                    x: 600 + 6,
                    y: 700 + 44,
                },
                imgSrc: "./res/img/fireboy_legs_sprite.png",
                imgRows: 2,
                currentRow: 1,
                frameRate: 1,
                frameDelay: 4,
                animations: {
                    idle: {
                        currentRow: 1,
                        frameRate: 1,
                    },
                    left: {
                        currentRow: 2,
                        flipImage: true,
                        frameRate: 8,
                    },
                    right: {
                        currentRow: 2,
                        frameRate: 8,
                    },
                },
            }),
        })
    );

    //watergirl
    players.push(
        new Player({
            collisionBlocks,
            diamonds,
            position: {
                x: 550,
                y: 870,
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
            imgRows: 4,
            currentRow: 1,
            animations: {
                idle: {
                    currentRow: 1,
                    frameRate: 1,
                },
                left: {
                    currentRow: 2,
                    frameRate: 8,
                    flipImage: true,
                },
                right: {
                    currentRow: 2,
                    frameRate: 8,
                },
                up: {
                    currentRow: 3,
                    frameRate: 1,
                },
                down: {
                    currentRow: 4,
                    frameRate: 1,
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
                    left: {
                        currentRow: 2,
                        flipImage: true,
                        frameRate: 8,
                    },
                    right: {
                        currentRow: 2,
                        frameRate: 8,
                    },
                },
            }),
        })
    );

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

            players.forEach((player) => {
                player.checkDiamonds();
            });

            diamonds.forEach((diamond) => {
                diamond.draw();
            });

            players.forEach((player) => {
                if (player.keys.pressed.left) {
                    player.velocity.x = -4;
                    player.changeSprite("left");
                } else if (player.keys.pressed.right) {
                    player.velocity.x = 4;
                    player.changeSprite("right");
                } else {
                    player.velocity.x = 0;
                    if (player.velocity.y < -1.5) {
                        player.changeSprite("up");
                    } else if (player.velocity.y > 1.5) {
                        player.changeSprite("down");
                    } else {
                        player.changeSprite("idle");
                    }
                }

                player.draw();
                player.legs.draw();
                player.update();
            });

            ponds.forEach((pond) => {
                pond.draw();
            });

            pauseButton.draw();

            players.forEach((player) => {
                if (player.died) {
                    endGame = true;
                }
            });

            if (endGame) {
                endFunction();
                return;
            } else if (pauseGame) {
                menuActive = "paused";
                drawMenuAnimation(drawMenuPause);
                return;
            }
        }
        requestAnimationFrame(animation);
    }
    animation();

    function endFunction() {
        menuActive = "lost";

        drawMenuAnimation(drawMenuLost);
    }

    function drawAll() {
        map.draw();
        collisionBlocks.forEach((collisionBlock) => {
            collisionBlock.draw();
        });
        diamonds.forEach((diamond) => {
            diamond.draw();
        });
        players.forEach((player) => {
            player.draw();
            player.legs.draw();
        });
        ponds.forEach((pond) => {
            pond.draw();
        });
        pauseButton.draw();
    }

    function drawMenuAnimation(name) {
        let transform = 1000;

        const menuAnimation = setInterval(() => {
            drawAll();

            name(transform);
            transform -= 10;
            if (transform < 0) {
                clearInterval(menuAnimation);
            }
        }, 1);
    }

    canvas.onmousedown = (event) => {
        if (menuButtonPressed) return;

        const mousePos = getMousePos(event);

        for (const menuButton in buttons[menuActive]) {
            if (checkButtonCollision(mousePos, buttons[menuActive][menuButton])) {
                menuButtonPressed = menuButton;
                buttons[menuActive][menuButton].scaleDown();
                buttons[menuActive][menuButton].draw();
            }
        }
    };

    canvas.onmouseup = (event) => {
        const mousePos = getMousePos(event);

        if (!menuActive) {
            if (checkButtonCollision(mousePos, pauseButton)) {
                pauseGame = true;
            }
            return;
        }

        for (const menuButton in buttons[menuActive]) {
            if (
                checkButtonCollision(mousePos, buttons[menuActive][menuButton]) &&
                menuButtonPressed == menuButton
            ) {
                buttons[menuActive][menuButton].resetSize();
                buttons[menuActive][menuButton].draw();

                setTimeout(() => {
                    if (!menuActive) return;

                    buttons[menuActive][menuButton].run();

                    if (continueAnimation) {
                        let transform = 0;
                        const menuAnimation = setInterval(() => {
                            drawAll();

                            drawMenuPause(transform);

                            transform += 10;
                            if (transform >= 1000) {
                                clearInterval(menuAnimation);
                                animation();
                                continueAnimation = false;
                            }
                        }, 1);
                    }

                    menuActive = null;
                    menuButtonPressed = null;
                }, 200);
                return;
            }
        }

        if (menuButtonPressed) {
            buttons[menuActive][menuButtonPressed].resetSize();
            buttons[menuActive][menuButtonPressed].draw();
            menuButtonPressed = null;
        }
    };

    window.addEventListener("keydown", (event) => {
        if (pauseGame) return;
        players.forEach((player) => {
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
    });

    window.addEventListener("keyup", (event) => {
        if (pauseGame) return;
        players.forEach((player) => {
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
    });
}
