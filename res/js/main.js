const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

let currentLevel = 1;

window.onload = () => {
    playGame(currentLevel);
};

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
