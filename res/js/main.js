const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.height = 36 * 29;
canvas.width = 36 * 39;

const collisionBlocks = createObjectsFromArray(collisionsLevel1);

const level1 = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imgSrc: "./res/img/map1.png",
});

const player = new Player({
    collisionBlocks: collisionBlocks,
    position: {
        x: 900,
        y: 1000,
    },
    imgSrc: "./res/img/watergirl.png",

    legs: new Sprite({
        position: {
            x: 900,
            y: 1000,
        },
        imgSrc: "./res/img/watergirl_legs.png",
    }),
});

let keys = {
    a: false,
    d: false,
    w: false,
};

let now;
let delta;
let fixedFps = 60;
let interval = 1000 / fixedFps;
let then = Date.now();

function animation() {
    window.requestAnimationFrame(animation);

    now = Date.now();
    delta = now - then;

    if (delta > interval) {
        then = now - (delta % interval);

        level1.draw();
        collisionBlocks.forEach((collisionBlock) => {
            collisionBlock.draw();
        });

        if (keys.a) player.velocity.x = -2;
        else if (keys.d) player.velocity.x = 2;
        else player.velocity.x = 0;

        player.legs.draw();
        player.draw();
        player.update();
    }
}
animation();

window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "w":
            if (!keys.w && player.isOnBlock) {
                player.velocity.y = -15;
                keys.w = true;
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
        case "w":
            keys.w = false;
            break;
        case "a":
            keys.a = false;
            break;
        case "d":
            keys.d = false;
            break;
    }
});
