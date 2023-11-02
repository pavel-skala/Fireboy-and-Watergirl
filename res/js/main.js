const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.height = 36 * 29;
canvas.width = 36 * 39;

class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100,
        };
        this.velocity = {
            x: 0,
            y: 0,
        };

        this.height = 36;
        this.width = 36;
    }
    update() {
        c.fillStyle = "rgb(0,0,255)";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y;
        if (this.position.y + this.height+ this.velocity.y < canvas.height) {
            this.velocity.y++;
        } 
        else this.velocity.y = 0;
    }
}

const player = new Player();

let keys = {
    a: false,
    d: false,
};

function animation() {
    window.requestAnimationFrame(animation);
    c.clearRect(0, 0, canvas.width, canvas.height);
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