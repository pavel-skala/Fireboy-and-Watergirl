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

        this.height = 36;
        this.width = 36;
    }
    update() {
        c.fillStyle = "rgb(0,0,255)";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
        this.position.y++;
    }
}

const player = new Player();

function animation() {
    window.requestAnimationFrame(animation);
    c.clearRect(0, 0, canvas.height, canvas.width);
    player.update();
}
animation();
