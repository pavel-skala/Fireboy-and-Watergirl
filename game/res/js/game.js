import { Player } from "./player.js";
import { Sprite } from "./sprite.js";
import { levels } from "./collisionBlocks.js";
import { createObjectsFromArray } from "./collisions.js";
import { Diamond } from "./ingameAssets/diamond.js";
import { Button } from "./ingameAssets/button.js";
import { Ramp } from "./ingameAssets/ramp.js";
import { Lever } from "./ingameAssets/lever.js";
import { pauseButton, menuButtons, checkButtonCollision } from "./menu/buttons.js";
import {
    getMousePos,
    continueAnimation,
    setContinueAnimation,
    endGame,
    currentLevel,
    gameData,
    setEndGame,
    canvas,
    menuActive,
    setMenuActive,
    setCurrentLevel,
    setLevelCompleted,
    allDiamonds,
    setAllDiamonds,
    menuLevelsPath,
    menuLevels,
    saveDataToLocalStorage,
    canClick,
    pickedCharacter,
    menuButtonPressed,
    setMenuButtonPressed,
    gameType,
    roomDeleted,
} from "./helpers.js";
import { checkMenuDiamondsCollision, drawInGameMenu, drawMainMenu } from "./menu/menus.js";
import { Cube } from "./ingameAssets/cube.js";
import { Door } from "./ingameAssets/door.js";
import { Bridge } from "./ingameAssets/bridge.js";
import { drawTime, formatTime, levelTime } from "./time.js";
import { Ball } from "./ingameAssets/ball.js";
import { socket } from "./online.js";


let bgBlocks, died, pauseGame, collisionBlocks, ponds;

let allAssets = [];
let allButtons = [];
let allCubes = [];
let allDoors = [];
let allLevers = [];
let allBridges = [];
let allBalls = [];

let allPlayers = {};

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

function startGame() {
    died = false;
    setMenuButtonPressed(null);
    pauseGame = false;

    allAssets = [];
    allButtons = [];
    setAllDiamonds([]);
    allPlayers = {};
    allDoors = [];
    allLevers = [];
    allCubes = [];
    allBridges = [];
    allBalls = [];

    setLevelCompleted(false);

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
                type: diamond.type,
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

    //bridges
    if (gameData.bridges[currentLevel]) {
        gameData.bridges[currentLevel].forEach((bridge) => {
            const newBridge = new Bridge({
                position: { ...bridge.position },
                chainsCount: bridge.chainsCount,
            });

            allBridges.push(newBridge);
            allAssets.push(newBridge);
        });
    }

    //balls
    if (gameData.balls[currentLevel]) {
        gameData.balls[currentLevel].forEach((ball) => {
            const newBall = new Ball({
                position: { ...ball.position },
                collisionBlocks,
                allAssets,
            });

            allBalls.push(newBall);
            allAssets.push(newBall);
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

        allPlayers[player] = new Player({
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
        });
    }
}

function playGame() {
    drawMainMenu();


    let now;
    let delta;
    let fixFps = 60;
    let interval = 1000 / fixFps;
    let then = Date.now();

    let time;

    function animation() {
        now = Date.now();
        delta = now - then;

        if (delta > interval) {
            // fpsCount();
            then = now - (delta % interval);

            background.draw();

            for (const character in allPlayers) {
                allPlayers[character].checkDiamonds();
            }

            for (const diamond of allDiamonds) {
                diamond.draw();
            }

            for (const buttons of allButtons) {
                let movedRamp = false;
                for (const button of buttons) {
                    if (button.pressed) {
                        if (button.position.y == button.finalPosition.y) {
                            let standingOnButton = false;
                            for (const character in allPlayers) {
                                if (
                                    button.checkStandingOnButton(
                                        allPlayers[character],
                                        allPlayers[character].hitbox.legs
                                    )
                                ) {
                                    standingOnButton = true;
                                }
                            }
                            allCubes.forEach((cube) => {
                                if (button.checkStandingOnButton(cube, cube.hitbox)) {
                                    standingOnButton = true;
                                }
                            });
                            allBalls.forEach((ball) => {
                                if (button.checkStandingOnButton(ball, ball.hitbox)) {
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

            allLevers.forEach((lever) => {
                lever.run();
            });

            allDoors.forEach((door) => {
                door.draw();
                door.pressed = false;
            });
            allBalls.forEach((ball) => {
                ball.draw();
                ball.update();
            });

            allBridges.forEach((bridge) => {
                bridge.drawChain();
                bridge.draw();
            });

            bgBlocks.draw();
            // collisionBlocks.forEach((collisionBlock) => {
            //     collisionBlock.draw();
            // });

            allLevers.forEach((lever) => {
                lever.checkAngle();
                lever.drawLever();
            });

            // if (keys.a) player.velocity.x = -1;
            // // if (keys.a) player.velocity.x = -2;
            // // else if (keys.d) player.velocity.x = 2;
            // else if (keys.d) player.velocity.x = 1;
            // else player.velocity.x = 0;
            for (const character in allPlayers) {
                let player = allPlayers[character];

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
                if (character == pickedCharacter) {
                    socket.emit("player-moved", player.position);
                }

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
            }

            ponds.forEach((pond) => {
                pond.draw();
            });

            //time calc
            time = now - startedTime - pausedTime;
            const formatedTime = formatTime(time);
            drawTime(formatedTime.minutes, formatedTime.seconds);

            //both doors opened
            if (allDoors[0].opened == true && allDoors[1].opened == true) {
                setLevelCompleted(true);
                levelTime.minutes = formatedTime.minutes;
                levelTime.seconds = formatedTime.seconds;
                playersDissapearing();
                return;
            }

            pauseButton.draw();

            if (roomDeleted) {
                // window.location.reload()
                return
            }

            if (died) {
                setMenuActive("lost");
                drawMenuAnimation(menuActive, "up");
                return;
            } else if (pauseGame) {
                setMenuActive("paused");
                drawMenuAnimation(menuActive, "up");
                return;
            }
        }
        requestAnimationFrame(animation);
    }

    // animation();

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
        allCubes.forEach((cube) => {
            cube.draw();
        });
        allLevers.forEach((lever) => {
            lever.ramp.draw();
        });
        allBridges.forEach((bridge) => {
            bridge.drawChain();
            bridge.draw();
        });
        allDoors.forEach((door) => {
            door.draw();
        });
        allBalls.forEach((ball) => {
            ball.draw();
        });
        bgBlocks.draw();
        // collisionBlocks.forEach((collisionBlock) => {
        //     collisionBlock.draw();
        // });
        allLevers.forEach((lever) => {
            lever.drawLever();
        });
        for (const character in allPlayers) {
            allPlayers[character].draw();
            allPlayers[character].legs.draw();
        }
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
                menuLevels[currentLevel].quests.forEach((quest) => {
                    quest.setVariable();
                    quest.check();
                    if (quest.completed) {
                        if (menuLevels[currentLevel].quests.length == 1) {
                            questCount += 2;
                        } else {
                            questCount++;
                        }
                    }
                });
                if (questCount > menuLevels[currentLevel].questsStatus) {
                    menuLevels[currentLevel].setQuestsStatus(questCount);
                }

                menuLevels[currentLevel].levelsUnlocking.forEach((index) => {
                    menuLevels[index].unlocked = true;
                });
                menuLevels[currentLevel].pathUnlocking.forEach((index) => {
                    menuLevelsPath[index].unlocked = true;
                });

                if (gameType == "offline") {
                    saveDataToLocalStorage();
                }

                setMenuActive("won");
                drawMenuAnimation("won", "up");
            }
            allDoors.forEach((door) => {
                door.draw();
            });
            for (const character in allPlayers) {
                allPlayers[character].opacity = opacity;
                allPlayers[character].draw();
                allPlayers[character].legs.opacity = opacity;
                allPlayers[character].legs.draw();
            }
        }, 50);
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

    canvas.onmouseup = (event) => {
        if (!canClick) return;
        const mousePos = getMousePos(event);

        if (!menuActive) {
            if (checkButtonCollision(mousePos, pauseButton)) {
                socket.emit("menu-button-pressed", "pauseButton");
                pauseGame = true;
                for (const character in allPlayers) {
                    for (const key in allPlayers[character].keys.pressed) {
                        allPlayers[character].keys.pressed[key] = false;
                    }
                    pausedStartTime = Date.now();
                }
                pausedStartTime = Date.now();
            }
            return;
        }

        if (checkButtonCollision(mousePos, menuButtons.menuBackground.author)) {
            menuButtons.menuBackground.author.resetSize();
            menuButtons.menuBackground.author.draw();

            setTimeout(() => {
                menuButtons.menuBackground.author.run();

                setMenuButtonPressed(null);
            }, 200);
            return;
        }

        if (menuActive == "mainMenu") {
            for (const index in menuLevels) {
                if (checkMenuDiamondsCollision(mousePos, menuLevels[index])) {
                    socket.emit("menu-diamond-pressed", index);
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
                    let reference = {
                        menuActive,
                        menuButton,
                    };
                    socket.emit("menu-button-pressed", reference);

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
                    setMenuButtonPressed(null);
                }, 200);
                return;
            }
        }

        if (menuButtonPressed == "author") {
            menuButtons.menuBackground.author.resetSize();
            menuButtons.menuBackground.author.draw();
            setMenuButtonPressed(null);
        }

        if (menuButtonPressed) {
            menuButtons[menuActive][menuButtonPressed].resetSize();
            menuButtons[menuActive][menuButtonPressed].draw();
            setMenuButtonPressed(null);
        }
    };

    function fpsCount() {
        let timeNow = Date.now();
        frame++;

        if (timeNow - startTime > 1000) {
            fps = Math.round((frame / ((timeNow - startTime) / 1000)).toFixed(1));
            fpsDisplay.innerText = `${fps} FPS`;
            // fpsDisplay.style.display = "block"
            startTime = timeNow;
            frame = 0;
        }
    }

    socket.on("menu-diamond-pressed", (levelIndex) => {
        setCurrentLevel(levelIndex);
        setMenuActive(null);
        startGame();
        animation();
    });

    socket.on("menu-button-pressed", (buttonReference) => {
        if (buttonReference == "pauseButton") {
            pauseGame = true;
            for (const character in allPlayers) {
                for (const key in allPlayers[character].keys.pressed) {
                    allPlayers[character].keys.pressed[key] = false;
                }
                pausedStartTime = Date.now();
            }
            pausedStartTime = Date.now();
            return;
        }

        let button = menuButtons[buttonReference.menuActive][buttonReference.menuButton];
        button.run();
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
    });

    // socket.on("player-moved", (playerPosition) => {
    //     for (const character in allPlayers) {
    //         if (pickedCharacter != character) {
    //             // allPlayers[character].position = playerPosition;
    //         }
    //     }
    // });

    socket.on("key-down", (key, position) => {
        for (const character in allPlayers) {
            if (character == pickedCharacter) continue;
            const player = allPlayers[character];
            switch (key) {
                case player.keys.up:
                    if (player.isOnBlock && !player.keys.pressed.up && !player.rampBlocked) {
                        player.velocity.y = -4.35;
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

            player.position = position;
        }
    });

    socket.on("key-up", (key, position) => {
        for (const character in allPlayers) {
            if (character == pickedCharacter) continue;
            const player = allPlayers[character];
            switch (key) {
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

            player.position = position;
        }
    });

    window.addEventListener("keydown", (event) => {
        if (pauseGame) return;
        for (const character in allPlayers) {
            if (pickedCharacter != character) continue;
            const player = allPlayers[character];
            let pressedKey;
            switch (event.key) {
                case player.keys.up:
                    if (player.isOnBlock && !player.keys.pressed.up && !player.rampBlocked) {
                        pressedKey = player.keys.up;
                        player.velocity.y = -4.35;
                        player.keys.pressed.up = true;
                    }
                    break;
                case player.keys.left:
                    pressedKey = player.keys.left;
                    player.keys.pressed.left = true;
                    break;
                case player.keys.right:
                    pressedKey = player.keys.right;
                    player.keys.pressed.right = true;
                    break;
            }
            if (pressedKey) {
                socket.emit("key-down", pressedKey, player.position);
            }
        }
    });

    window.addEventListener("keyup", (event) => {
        if (pauseGame) return;

        for (const character in allPlayers) {
            if (pickedCharacter != character) continue;
            const player = allPlayers[character];
            let pressedKey;
            switch (event.key) {
                case player.keys.up:
                    pressedKey = player.keys.up;
                    player.keys.pressed.up = false;
                    break;
                case player.keys.left:
                    pressedKey = player.keys.left;
                    player.keys.pressed.left = false;
                    break;
                case player.keys.right:
                    pressedKey = player.keys.right;
                    player.keys.pressed.right = false;
                    break;
            }
            if (pressedKey) {
                socket.emit("key-up", pressedKey, player.position);
            }
        }
    });
    document.addEventListener("visibilitychange", () => {
        for (const character in allPlayers) {
            for (const key in allPlayers[character].keys.pressed) {
                allPlayers[character].keys.pressed[key] = false;
            }
        }
    });

    document.addEventListener("contextmenu", () => {
        for (const character in allPlayers) {
            for (const key in allPlayers[character].keys.pressed) {
                allPlayers[character].keys.pressed[key] = false;
            }
        }
    });

    window.onclick = () => {
        // console.log("pepa");
    };
    document.addEventListener("change", () => {
        console.log("pepík");
    });
}

export { playGame };
