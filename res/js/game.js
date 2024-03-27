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
    menuActive,
    setMenuActive,
    setCurrentLevel,
} from "./helpers.js";
import { drawInGameMenu, drawMenu, checkMenuDiamondsCollision, menuDiamonds } from "./menus.js";
import { Lever } from "./classes/lever.js";
import { Cube } from "./classes/cube.js";
import { Door } from "./classes/door.js";
import { Quest } from "./quests.js";
import { drawTime, formatTime, levelTime } from "./time.js";

let bgBlocks, died, menuButtonPressed, pauseGame, collisionBlocks, ponds;

let allAssets = [];
let allPlayers = [];
let allDiamonds = [];
let allButtons = [];
let allLevers = [];
let allCubes = [];
let allDoors = [];

let levelCompleted = false;

let startedTime;
let pausedTime = 0;
let pausedStartTime;

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imgSrc: `./res/img/maps/bg.png`,
});

let quests = [];
quests.push(
    new Quest({
        position: {
            x: 450,
            y: 500,
        },
        offsetY: 220,
        currentRow: 1,
        requirement: {
            variable: levelCompleted,
            getVariable: () => {
                return levelCompleted;
            },
            required: true,
        },
    })
);
quests.push(
    new Quest({
        position: {
            x: 450,
            y: 600,
        },
        offsetY: 350,
        currentRow: 2,
        requirement: {
            variable: allDiamonds,
            getVariable: () => {
                return allDiamonds;
            },
            required: [],
        },
    })
);

function startGame() {
    died = false;
    menuButtonPressed = null;
    pauseGame = false;

    allAssets = [];
    allPlayers = [];
    allDiamonds = [];
    allButtons = [];
    allLevers = [];
    allCubes = [];
    allDoors = [];

    levelCompleted = false;
    startedTime = Date.now();
    pausedTime = 0;

    const values = createObjectsFromArray(levels[currentLevel]);
    collisionBlocks = values.objects;
    ponds = values.ponds;

    bgBlocks = new Sprite({
        position: {
            x: 0,
            y: 0,
        },
        imgSrc: `./res/img/maps/level${currentLevel}.png`,
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
    if (gameData.buttons[currentLevel]) {
        gameData.buttons[currentLevel].forEach((buttonGroup) => {
            const color = buttonGroup.ramp.color;
            const finalColor = buttonGroup.ramp.finalColor;

            const ramp = new Ramp({
                position: { ...buttonGroup.ramp.position },
                boxCount: buttonGroup.ramp.boxCount,
                color,
                finalColor,
                finalPosition: buttonGroup.ramp.finalPosition,
                rotated: buttonGroup.ramp.rotated,
            });
            allAssets.push(ramp);

            let groupButtons = [];

            buttonGroup.buttons.forEach((button) => {
                const newButton = new Button({
                    position: { ...button.position },
                    color,
                    finalColor,
                    ramp,
                });
                groupButtons.push(newButton);
                allAssets.push(newButton);
            });
            allButtons.push(groupButtons);
        });
    }

    //levers
    if (gameData.levers[currentLevel]) {
        gameData.levers[currentLevel].forEach((leverGroup) => {
            const color = leverGroup.ramp.color;
            const finalColor = leverGroup.ramp.finalColor;

            const ramp = new Ramp({
                position: { ...leverGroup.ramp.position },
                boxCount: leverGroup.ramp.boxCount,
                color,
                finalColor,
                finalPosition: leverGroup.ramp.finalPosition,
                rotated: leverGroup.ramp.rotated,
            });
            allAssets.push(ramp);

            const lever = new Lever({
                position: leverGroup.lever.position,
                color,
                finalColor,
                ramp,
            });
            allLevers.push(lever);
            allAssets.push(lever);
        });
    }

    //cubes
    if (gameData.cubes[currentLevel]) {
        gameData.cubes[currentLevel].forEach((cube) => {
            const newCube = new Cube({
                position: { ...cube.position },
                collisionBlocks,
                allAssets,
                players: allPlayers,
            });
            allCubes.push(newCube);
            allAssets.push(newCube);
        });
    }

    //doors
    gameData.doors[currentLevel].forEach((door) => {
        const newDoor = new Door({
            position: door.position,
            element: door.element,
        });
        allDoors.push(newDoor);
    });

    //players
    for (const player in gameData.players) {
        const currentPlayer = gameData.players[player];

        allPlayers.push(
            new Player({
                position: { ...currentPlayer[currentLevel].position },
                collisionBlocks,
                allAssets,
                diamonds: allDiamonds,
                doors: allDoors,
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

function playGame() {
    drawMenu();
    // startGame();

    let now;
    let delta;
    let fixedFps = 60;
    let interval = 1000 / fixedFps;
    let then = Date.now();

    let time;

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
                            allCubes.forEach((cube) => {
                                if (
                                    cube.isOnBlock &&
                                    cube.hitbox.position.x + cube.hitbox.width >=
                                        button.hitbox.position.x &&
                                    cube.hitbox.position.x <=
                                        button.hitbox.position.x + button.hitbox.width &&
                                    cube.hitbox.position.y + cube.hitbox.height >=
                                        button.hitbox.position.y - 2 &&
                                    cube.hitbox.position.y + cube.hitbox.height <=
                                        button.hitbox.position.y + button.hitbox.height
                                ) {
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
            // collisionBlocks.forEach((collisionBlock) => {
            //     collisionBlock.draw();
            // });

            allCubes.forEach((cube) => {
                cube.draw();
                cube.update();
                if (cube.rampBlocked) {
                    allAssets.forEach((asset) => {
                        if (
                            asset.hitbox.position.y ==
                            Math.round(cube.hitbox.position.y + cube.hitbox.height)
                        ) {
                            asset.blocked = true;
                            asset.blockedDirection = "up";
                        }
                    });
                }
            });

            allDoors.forEach((door) => {
                door.draw();
                door.pressed = false;
            });

            allLevers.forEach((lever) => {
                lever.checkAngle();
                lever.drawLever();
                lever.run();
            });

            allPlayers.forEach((player) => {
                if (player.keys.pressed.left) {
                    player.velocity.x = -2;
                    player.changeSprite("left");
                } else if (player.keys.pressed.right) {
                    player.velocity.x = 2;
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
                    allAssets.forEach((asset) => {
                        if (
                            asset.hitbox.position.y ==
                            Math.round(player.hitbox.position.y + player.hitbox.height)
                        ) {
                            asset.blocked = true;
                            asset.blockedDirection = "up";
                        }
                    });
                }

                player.checkDoors();

                if (player.died) {
                    died = true;
                }
            });

            ponds.forEach((pond) => {
                pond.draw();
            });

            //time calc
            time = now - startedTime - pausedTime;
            const formatedTime = formatTime(time);
            drawTime(formatedTime.minutes, formatedTime.seconds);

            //both doors opened
            if (allDoors[0].opened == true && allDoors[1].opened == true) {
                levelCompleted = true;
                levelTime.minutes = formatedTime.minutes;
                levelTime.seconds = formatedTime.seconds;
                playersDissapearing();
                return;
            }

            pauseButton.draw();

            if (died) {
                endFunction("lost");
                return;
            } else if (pauseGame) {
                setMenuActive("paused");
                drawMenuAnimation(menuActive, "up");
                return;
            }
        }
        requestAnimationFrame(animation);
    }

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
        // collisionBlocks.forEach((collisionBlock) => {
        //     collisionBlock.draw();
        // });
        allCubes.forEach((cube) => {
            cube.draw();
        });
        allDoors.forEach((door) => {
            door.draw();
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
        const formatedTime = formatTime(time);
        drawTime(formatedTime.minutes, formatedTime.seconds);
        pauseButton.draw();
    }

    function playersDissapearing() {
        let opacity = 1;
        const dissapearing = setInterval(() => {
            opacity -= 0.05;
            if (opacity <= 0) {
                opacity = 0;
                clearInterval(dissapearing);
                let questCount = 0;
                quests.forEach((quest) => {
                    quest.setVariable();
                    quest.check();
                    if (quest.completed) {
                        questCount++;
                    }
                });
                if (questCount > menuDiamonds[currentLevel].questsStatus) {
                    menuDiamonds[currentLevel].setQuestsStatus(questCount);
                }

                menuDiamonds[currentLevel].diamondsUnlocking.forEach((index) => {
                    menuDiamonds[index].unlocked = true;
                });
                endFunction("won");
            }
            allDoors.forEach((door) => {
                door.draw();
            });
            allPlayers.forEach((player) => {
                player.opacity = opacity;
                player.draw();
                player.legs.opacity = opacity;
                player.legs.draw();
            });
        }, 50);
    }

    function endFunction(status) {
        setMenuActive(status);

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
                pausedStartTime = Date.now();
            }
            return;
        }

        if (menuActive == "mainMenu") {
            for (const index in menuDiamonds) {
                if (checkMenuDiamondsCollision(mousePos, menuDiamonds[index])) {
                    setCurrentLevel(index);
                    setMenuActive(null);
                    startGame();
                    animation();
                }
            }
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
                        pausedTime += Date.now() - pausedStartTime;
                    }
                    if (endGame) {
                        setEndGame(false);
                        startGame();
                        animation();
                    }
                    if (menuActive != "mainMenu") {
                        setMenuActive(null);
                    }
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
                        player.velocity.y = -4;
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

export { playGame, quests };
