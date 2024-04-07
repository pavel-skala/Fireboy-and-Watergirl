import { ctx } from "./helpers.js";

let levelTime = {
    minutes: 0,
    seconds: 0,
};

function formatTime(miliseconds) {
    let seconds = Math.floor(miliseconds / 1000);
    let minutes = Math.floor(seconds / 60);

    seconds = seconds % 60;
    seconds = seconds.toString();
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    minutes.toString();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    return { minutes, seconds };
}

function drawTime(minutes, seconds) {
    const fullText = minutes + ":" + seconds;

    //background
    drawTimeBackground("black", 0);
    drawTimeBackground("#83641D", 5);
    drawTimeBackground("black", 15);

    //time
    ctx.font = "50px Cinzel";
    ctx.lineWidth = 7;
    ctx.strokeStyle = "black";
    ctx.strokeText(fullText, 17 * 36 + 28, 36);

    ctx.fillStyle = "yellow";
    ctx.fillText(fullText, 17 * 36 + 28, 36);
}

function drawTimeBackground(color, offset) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(16 * 36 + offset, 0);
    ctx.lineTo(17 * 36 + offset / 2, 50 - offset / 2);
    ctx.lineTo(22 * 36 - offset / 2, 50 - offset / 2);
    ctx.lineTo(23 * 36 - offset, 0);
    ctx.fill();
}

export { levelTime, formatTime, drawTime };
