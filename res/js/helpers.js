const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const GAME_SIZE = {
    width: 39,
    height: 29,
    block: {
        width: 36,
        height: 36,
    },
};

canvas.height = GAME_SIZE.block.height * GAME_SIZE.height;
canvas.width = GAME_SIZE.block.width * GAME_SIZE.width;

function getMousePos(event) {
    const rect = canvas.getBoundingClientRect();
    const scale = {
        x: canvas.width / rect.width,
        y: canvas.height / rect.height,
    };
    return {
        x: (event.clientX - rect.left) * scale.x,
        y: (event.clientY - rect.top) * scale.y,
    };
}

let continueAnimation = false;
let endGame = false;
let currentLevel = 1;

function setContinueAnimation(setValue) {
    continueAnimation = setValue;
}

function setEndGame(setValue) {
    endGame = setValue;
}

function setCurrentLevel(setValue) {
    currentLevel = setValue;
}

let gameData = {};
const jsonsFiles = ["diamonds", "players", "assets"];

async function loadData() {
    try {
        for (const jsonFile of jsonsFiles) {
            const file = await fetch(`./res/data/${jsonFile}.json`);
            const data = await file.json();

            gameData[jsonFile] = data;
        }
    } catch (err) {
        console.log(err);
    }
}

export {
    getMousePos,
    GAME_SIZE,
    canvas,
    ctx,
    continueAnimation,
    setContinueAnimation,
    endGame,
    setEndGame,
    currentLevel,
    loadData,
    gameData,
};
