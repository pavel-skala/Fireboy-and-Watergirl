import { Player } from "./player.js";
import { Sprite } from "./sprite.js";
import { levels } from "./collisionBlocks.js";
import { createObjectsFromArray } from "./collisions.js";
import { Diamond } from "./classes/diamond.js";
import { pauseButton, menuButtons, checkButtonCollision } from "./buttons.js";
import {
    getMousePos,
    continueAnimation,
    setContinueAnimation,
    endGame,
    currentLevel,
    gameData,
    setEndGame,
} from "./helpers.js";
import { drawMenuPause, drawMenuLost } from "./menus.js";

let bgBlocks, menuActive, died, menuButtonPressed, pauseGame, collisionBlocks, ponds;

let diamonds = [];
let players = [];

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imgSrc: `./res/img/maps/bg.png`,
});

function startGame() {
    menuActive = null;
    died = false;
    menuButtonPressed = null;
    pauseGame = false;
    diamonds = [];
    players = [];

    const values = createObjectsFromArray(levels[currentLevel]);
    collisionBlocks = values.objects;
    ponds = values.ponds;

    bgBlocks = new Sprite({
        position: {
            x: 0,
            y: 0,
        },
        imgSrc: `./res/img/maps/blocks${currentLevel}.png`,
    });

    gameData["diamonds"][currentLevel].forEach((diamond) => {
        diamonds.push(
            new Diamond({
                position: diamond.position,
                element: diamond.element,
            })
        );
    });

    for (const player in gameData.players) {
        const currentPlayer = gameData.players[player];

        players.push(
            new Player({
                position: { ...currentPlayer[currentLevel].position },
                collisionBlocks,
                diamonds,
                imgSrc: currentPlayer.constants.imgSrc,
                element: currentPlayer.constants.element,
                frameRate: 1,
                frameDelay: 4,
                imgRows: 4,
                currentRow: 1,
                keys: {
                    up: currentPlayer.constants.keys.up,
                    left: currentPlayer.constants.keys.left,
                    right: currentPlayer.constants.keys.right,
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
                        x: currentPlayer[currentLevel].position.x + 37,
                        y: currentPlayer[currentLevel].position.y + 72,
                    },
                    imgSrc: currentPlayer.constants.legsImgSrc,
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
    }
}

export function playGame() {
    startGame()

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

            background.draw();

            players.forEach((player) => {
                player.checkDiamonds();
            });

            diamonds.forEach((diamond) => {
                diamond.draw();
            });

            bgBlocks.draw();
            collisionBlocks.forEach((collisionBlock) => {
                collisionBlock.draw();
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

                if (player.died) {
                    died = true;
                }
            });

            ponds.forEach((pond) => {
                pond.draw();
            });

            pauseButton.draw();

            if (died) {
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
        background.draw();
        diamonds.forEach((diamond) => {
            diamond.draw();
        });
        bgBlocks.draw();
        collisionBlocks.forEach((collisionBlock) => {
            collisionBlock.draw();
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

        for (const menuButton in menuButtons[menuActive]) {
            if (checkButtonCollision(mousePos, menuButtons[menuActive][menuButton])) {
                menuButtonPressed = menuButton;
                menuButtons[menuActive][menuButton].scaleDown();
                menuButtons[menuActive][menuButton].draw();
            }
        }
    };

    canvas.onmouseup = (event) => {
        const mousePos = getMousePos(event);

        if (!menuActive) {
            if (checkButtonCollision(mousePos, pauseButton)) {
                pauseGame = true;
                players.forEach((player) => {
                    for (const key in player.keys.pressed) {
                        player.keys.pressed[key] = false;
                    }
                });
            }
            return;
        }

        for (const menuButton in menuButtons[menuActive]) {
            if (
                checkButtonCollision(mousePos, menuButtons[menuActive][menuButton]) &&
                menuButtonPressed == menuButton
            ) {
                menuButtons[menuActive][menuButton].resetSize();
                menuButtons[menuActive][menuButton].draw();

                setTimeout(() => {
                    if (!menuActive) return;

                    menuButtons[menuActive][menuButton].run();
                    pauseGame = false;

                    if (continueAnimation) {
                        let transform = 0;
                        const menuAnimation = setInterval(() => {
                            drawAll();

                            drawMenuPause(transform);
                            transform += 10;
                            if (transform >= 1000) {
                                clearInterval(menuAnimation);
                                animation();
                                setContinueAnimation(false);
                            }
                        }, 1);
                    }
                    if (endGame) {
                        setEndGame(false);
                        startGame();
                        animation();
                    }
                    menuActive = null;
                    menuButtonPressed = null;
                }, 200);
                return;
            }
        }

        if (menuButtonPressed) {
            menuButtons[menuActive][menuButtonPressed].resetSize();
            menuButtons[menuActive][menuButtonPressed].draw();
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
