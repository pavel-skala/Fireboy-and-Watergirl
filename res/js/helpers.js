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
let menuActive = "mainMenu";
let levelCompleted = false;
let allDiamonds = [];

let menuLevels = {};
let menuLevelsPath = {};

function setContinueAnimation(setValue) {
    continueAnimation = setValue;
}

function setEndGame(setValue) {
    endGame = setValue;
}

function setCurrentLevel(setValue) {
    currentLevel = setValue;
}

function setMenuActive(setValue) {
    menuActive = setValue;
}

function setLevelCompleted(setValue) {
    levelCompleted = setValue;
}

function setAllDiamonds(setValue) {
    allDiamonds = setValue;
}

function setMenuLevels(setValue) {
    menuLevels = setValue;
}

function setMenuLevelsPath(setValue) {
    menuLevelsPath = setValue;
}

let gameData = {};
const jsonsFiles = [
    "players",
    "diamonds",
    "buttons",
    "levers",
    "cubes",
    "doors",
    "bridges",
    "balls",
];

async function loadData() {
    try {
        jsonsFiles.map(async (jsonFile) => {
            const file = await fetch(`./res/data/${jsonFile}.json`);
            const data = await file.json();

            gameData[jsonFile] = data;
        });
    } catch (err) {
        console.log(err);
    }
}

function loadDataFromLocalStorage() {
    let newLevels = window.localStorage.getItem("menuLevels");
    if (newLevels) {
        newLevels = JSON.parse(newLevels);
        for (let i = 1; i <= Object.keys(newLevels).length; i++) {
            for (const key in newLevels[i]) {
                menuLevels[i][key] = newLevels[i][key];
                menuLevels[i].setQuestsStatus(menuLevels[i].questsStatus);
            }
        }
    }

    let newLevelsPath = window.localStorage.getItem("menuLevelsPath");
    if (newLevelsPath) {
        newLevelsPath = JSON.parse(newLevelsPath);
        for (let i = 1; i <= Object.keys(newLevelsPath).length; i++) {
            for (const key in newLevelsPath[i]) {
                menuLevelsPath[i][key] = newLevelsPath[i][key];
            }
        }
    }
}

function saveDataToLocalStorage() {
    let levels = {};

    for (let i = 1; i <= Object.keys(menuLevels).length; i++) {
        levels[i] = {};
        levels[i].unlocked = menuLevels[i].unlocked;
        levels[i].questsStatus = menuLevels[i].questsStatus;
    }

    let levelsPath = {};

    for (let i = 1; i <= Object.keys(menuLevelsPath).length; i++) {
        levelsPath[i] = {};
        levelsPath[i].unlocked = menuLevelsPath[i].unlocked;
    }

    window.localStorage.setItem("menuLevels", JSON.stringify(levels));
    window.localStorage.setItem("menuLevelsPath", JSON.stringify(levelsPath));
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
    setCurrentLevel,
    menuActive,
    setMenuActive,
    loadData,
    gameData,
    levelCompleted,
    setLevelCompleted,
    allDiamonds,
    setAllDiamonds,
    menuLevels,
    menuLevelsPath,
    setMenuLevels,
    setMenuLevelsPath,
    loadDataFromLocalStorage,
    saveDataToLocalStorage,
};
