const menuBg = new Sprite({
    position: {
        x: canvas.width * 0.1,
        y: canvas.height * 0.2,
    },
    imgSrc: "./res/img/menu_bg.png",
});

function drawMenuLost(transform) {
    menuBg.position.y += transform;
    menuBg.draw();

    c.font = "120px Cinzel";
    c.lineWidth = 7;
    c.strokeStyle = "black";
    c.strokeText("Game Over", canvas.width * 0.25, menuBg.position.y + canvas.height * 0.25);

    c.font = "120px Cinzel";
    c.fillStyle = "yellow";
    c.fillText("Game Over", canvas.width * 0.25, menuBg.position.y + canvas.height * 0.25);

    for (const name in buttons["lost"]) {
        buttons["lost"][name].updatePositionY(menuBg.position.y);
        buttons["lost"][name].draw();
    }

    menuBg.position.y -= transform;
}

function drawMenuPause(transform) {
    menuBg.position.y += transform;
    menuBg.draw();

    c.font = "120px Cinzel";
    c.lineWidth = 7;
    c.strokeStyle = "black";
    c.strokeText("Paused", canvas.width * 0.35, menuBg.position.y + canvas.height * 0.25);

    c.font = "120px Cinzel";
    c.fillStyle = "yellow";
    c.fillText("Paused", canvas.width * 0.35, menuBg.position.y + canvas.height * 0.25);

    for (const name in buttons["paused"]) {
        buttons["paused"][name].updatePositionY(menuBg.position.y);
        buttons["paused"][name].draw();
    }

    menuBg.position.y -= transform;
}

function drawMenu() {
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);

    c.font = "150px Cinzel";
    c.fillStyle = "yellow";
    c.fillText("Menu soon", canvas.width * 0.2, 200);
}
