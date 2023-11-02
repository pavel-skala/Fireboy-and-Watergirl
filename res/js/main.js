const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.height = 36 * 29;
canvas.width = 36 * 39;


const level1 = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imgSrc: "../res/img/map1.png"
})

const player = new Player();

let keys = {
    a: false,
    d: false,
};

function animation() {
    window.requestAnimationFrame(animation);

    level1.draw()

    if (keys.a)player.velocity.x = -7
    else if (keys.d) player.velocity.x = 7;
    else player.velocity.x = 0;

    player.update();
}
animation();

window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "w":
            if (player.velocity.y == 0) {
                player.velocity.y = -20;
            }
            break;
        case "a":
            keys.a = true;
            break;
        case "d":
            keys.d = true;
            break;
    }
});

window.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "a":
            keys.a = false;
            break;
        case "d":
            keys.d = false;
            break;
    }
});