import { Player } from "./player.js";
import { Sprite } from "./sprite.js";
import { levels } from "./collisionBlocks.js";
import { createObjectsFromArray } from "./collisions.js";
import { Diamond } from "./classes/diamond.js";
import { Button } from "./classes/button.js";
import { Ramp } from "./classes/ramp.js";
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
import { drawInGameMenu } from "./menus.js";
import { Lever } from "./classes/lever.js";

let bgBlocks, menuActive, died, menuButtonPressed, pauseGame, collisionBlocks, ponds;

let blocksAssets = [];
let allPlayers = [];
let allDiamonds = [];
let allButtons = [];
let allLevers = [];

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

    blocksAssets = [];
    allPlayers = [];
    allDiamonds = [];
    allButtons = [];
    allLevers = [];

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

    //diamonds
    gameData.diamonds[currentLevel].forEach((diamond) => {
        allDiamonds.push(
            new Diamond({
                position: diamond.position,
                element: diamond.element,
            })
        );
    });

    //buttons
    gameData.buttons[currentLevel].forEach((buttonGroup) => {
        const color = buttonGroup.ramp.color;
        const finalColor = buttonGroup.ramp.finalColor;

        const ramp = new Ramp({
            position: { ...buttonGroup.ramp.position },
            boxCount: buttonGroup.ramp.boxCount,
            color,
            finalColor,
            finalPosition: buttonGroup.ramp.finalPosition,
        });
        blocksAssets.push(ramp);

        let groupButtons = [];

        buttonGroup.buttons.forEach((button) => {
            const newButton = new Button({
                position: { ...button.position },
                color,
                finalColor,
                ramp,
            });
            groupButtons.push(newButton);
            blocksAssets.push(newButton);
        });
        allButtons.push(groupButtons);
    });

    //levers
    gameData.levers[currentLevel].forEach((leverGroup) => {
        const color = leverGroup.ramp.color;
        const finalColor = leverGroup.ramp.finalColor;

        const ramp = new Ramp({
            position: { ...leverGroup.ramp.position },
            boxCount: leverGroup.ramp.boxCount,
            color,
            finalColor,
            finalPosition: leverGroup.ramp.finalPosition,
        });
        blocksAssets.push(ramp);

        const lever = new Lever({
            position: leverGroup.lever.position,
            color,
            finalColor,
            ramp,
        });
        allLevers.push(lever);
        blocksAssets.push(lever);
    });

    //players
    for (const player in gameData.players) {
        const currentPlayer = gameData.players[player];

        allPlayers.push(
            new Player({
                position: { ...currentPlayer[currentLevel].position },
                collisionBlocks,
                blocksAssets,
                diamonds: allDiamonds,
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
    startGame();

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

            allPlayers.forEach((player) => {
                player.checkDiamonds();
            });

            allDiamonds.forEach((diamond) => {
                diamond.draw();
            });

            for (const buttons of allButtons) {
                let movedRamp = false;
                for (const button of buttons) {
                    if (button.pressed) {
                        if (button.position.y == button.finalPosition.y) {
                            let standingOnButton = false;
                            allPlayers.forEach((player) => {
                                if (
                                    player.isOnBlock &&
                                    player.hitbox.legs.position.x + player.hitbox.legs.width >=
                                        button.hitbox.position.x &&
                                    player.hitbox.legs.position.x <=
                                        button.hitbox.position.x + button.hitbox.width &&
                                    player.hitbox.position.y + player.hitbox.height >=
                                        button.hitbox.position.y - 2 &&
                                    player.hitbox.position.y + player.hitbox.height <=
                                        button.hitbox.position.y + button.hitbox.height
                                ) {
                                    // return
                                    standingOnButton = true;
                                }
                            });
                            if (!standingOnButton) {
                                button.pressed = false;
                                button.move("up");
                            }
                        } else {
                            button.move("down");
                        }
                    } else {
                        if (button.position.y != button.startPosition.y) {
                            button.move("up");
                        }
                    }

                    button.fillColor();
                    button.draw();
                    if (button.pressed && !movedRamp) {
                        movedRamp = true;
                        button.run();
                    }
                }
                if (!movedRamp) {
                    buttons[0].run();
                }
            }

            bgBlocks.draw();
            collisionBlocks.forEach((collisionBlock) => {
                collisionBlock.draw();
            });

            allLevers.forEach((lever) => {
                lever.checkAngle();
                lever.drawLever();
                lever.run();
            });

            allPlayers.forEach((player) => {
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

                if (player.rampBlocked) {
                    blocksAssets.forEach((blocksAsset) => {
                        if (
                            blocksAsset.hitbox.position.y ==
                            Math.round(player.hitbox.position.y + player.hitbox.height)
                        ) {
                            blocksAsset.blocked = true;
                            blocksAsset.blockedDirection = "up";
                        }
                    });
                }

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
                drawMenuAnimation(menuActive, "up");
                return;
            }
        }
        requestAnimationFrame(animation);
    }
    animation();

    function drawAll() {
        background.draw();
        allDiamonds.forEach((diamond) => {
            diamond.draw();
        });
        allButtons.forEach((buttonGroup) => {
            buttonGroup.forEach((button) => {
                button.fillColor();
                button.draw();
                button.ramp.draw(button.pressed);
            });
        });
        bgBlocks.draw();
        collisionBlocks.forEach((collisionBlock) => {
            collisionBlock.draw();
        });
        allLevers.forEach((lever) => {
            lever.drawLever();
            lever.ramp.draw();
        });
        allPlayers.forEach((player) => {
            player.draw();
            player.legs.draw();
        });
        ponds.forEach((pond) => {
            pond.draw();
        });
        pauseButton.draw();
    }

    function endFunction(status) {
        menuActive = status;

        drawMenuAnimation(status, "up");
    }

    function drawMenuAnimation(menuName, direction) {
        let transform = 1000;
        let value = 10;
        if (direction == "down") {
            transform = 0;
            value = -10;
        }
        const endTransform = Math.abs(transform - 1000);

        const menuAnimation = setInterval(() => {
            drawAll();

            transform -= value;
            drawInGameMenu(menuName, transform);
            if (transform == endTransform) {
                clearInterval(menuAnimation);
                if (direction == "down") {
                    animation();
                    setContinueAnimation(false);
                }
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
                allPlayers.forEach((player) => {
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
                        drawMenuAnimation(menuActive, "down");
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
        allPlayers.forEach((player) => {
            switch (event.key) {
                case player.keys.up:
                    if (player.isOnBlock && !player.keys.pressed.up && !player.rampBlocked) {
                        player.velocity.y = -11;
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

        allPlayers.forEach((player) => {
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
