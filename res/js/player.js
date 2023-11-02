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