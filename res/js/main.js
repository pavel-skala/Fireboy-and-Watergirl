const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.height = 36 * 29;
canvas.width = 36 * 39;

let currentLevel = 1;

window.onload = () => {
    playGame(currentLevel);
};
