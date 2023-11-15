const collisionsLevel1 = [
    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0,
    0, 0, 0, 0, 0, 2, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1,
    1, 3, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0,
    0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
    0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
    1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 0, 0, 0, 0, 0, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    4, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 4, 1, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 1, 1, 1, 1, 1, 1, 7, 6, 6, 6, 8, 1, 1, 1, 1, 3, 0, 0, 0, 0,
    1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 5, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 6, 6, 6, 8, 1, 1, 1, 7, 6,
    6, 6, 8, 1, 1, 1, 1, 0, 0, 0, 0,
];

class CollisionBlock {
    constructor({ position, shape, direction }) {
        this.position = position;
        this.shape = shape;
        this.direction = direction;
        this.height = 36;
        this.width = 36;
    }
    draw() {
        if (this.shape == "square") {
            c.fillStyle = "rgba(255,0,0,0.5)";
            c.fillRect(this.position.x, this.position.y, this.width, this.height);
        } else if (this.shape == "triangle") {
            c.fillStyle = "rgba(255, 251, 0, 0.575)";
            if (this.direction.x == "right" && this.direction.y == "up") {
                c.beginPath();
                c.moveTo(this.position.x, this.position.y);
                c.lineTo(this.position.x, this.position.y + this.height);
                c.lineTo(this.position.x + this.width, this.position.y + this.height);
                c.fill();
            } else if (this.direction.x == "left" && this.direction.y == "up") {
                c.beginPath();
                c.moveTo(this.position.x + this.width, this.position.y);
                c.lineTo(this.position.x, this.position.y + this.height);
                c.lineTo(this.position.x + this.width, this.position.y + this.height);
                c.fill();
            } else if (this.direction.x == "left" && this.direction.y == "down") {
                c.beginPath();
                c.moveTo(this.position.x, this.position.y);
                c.lineTo(this.position.x + this.width, this.position.y);
                c.lineTo(this.position.x + this.width, this.position.y + this.height);
                c.fill();
            } else if (this.direction.x == "right" && this.direction.y == "down") {
                c.beginPath();
                c.moveTo(this.position.x, this.position.y);
                c.lineTo(this.position.x + this.width, this.position.y);
                c.lineTo(this.position.x, this.position.y + this.height);
                c.fill();
            }
        } else if (this.shape == "pond") {
            c.fillStyle = "rgba(0, 255, 0, 0.575)";
            c.fillRect(this.position.x, this.position.y + 18, this.width, this.height - 18);
        } else if (this.shape == "pondTriangle") {
            c.fillStyle = "rgba(0, 255, 0, 0.575)";
            if (this.direction.x == "left") {
                c.beginPath();
                c.moveTo(this.position.x + this.width, this.position.y);
                c.lineTo(this.position.x + this.width, this.position.y + this.height);
                c.lineTo(this.position.x, this.position.y + this.height);
                c.lineTo(this.position.x, this.position.y + this.height / 2);
                c.fill();
            } else {
                c.beginPath();
                c.moveTo(this.position.x, this.position.y);
                c.lineTo(this.position.x, this.position.y + this.height);
                c.lineTo(this.position.x + this.width, this.position.y + this.height);
                c.lineTo(this.position.x + this.width, this.position.y + this.height / 2);
                c.fill();
            }
        }
    }
}

function createObjectsFromArray(array) {
    const objects = [];

    for (let i = 0; i < array.length; i++) {
        let shape;
        let direction = {
            x: null,
            y: null,
        };
        //square
        if (array[i] == 1) {
            shape = "square";
        }
        //triangle to left up
        else if (array[i] == 2) {
            shape = "triangle";
            direction = {
                x: "left",
                y: "up",
            };
        }
        //triangle to right up
        else if (array[i] == 3) {
            shape = "triangle";
            direction = {
                x: "right",
                y: "up",
            };
        }
        //triangle to left down
        else if (array[i] == 4) {
            shape = "triangle";
            direction = {
                x: "left",
                y: "down",
            };
        }
        //triangle to right down
        else if (array[i] == 5) {
            shape = "triangle";
            direction = {
                x: "right",
                y: "down",
            };
        }
        //pond
        else if (array[i] == 6) {
            shape = "pond";
        }
        //pond triangle to right
        else if (array[i] == 7) {
            shape = "pondTriangle";
            direction = {
                x: "right",
                y: "up",
            };
        }
        //pond triangle to left
        else if (array[i] == 8) {
            shape = "pondTriangle";
            direction = {
                x: "left",
                y: "up",
            };
        }

        //push object
        if (array[i] != 0) {
            objects.push(
                new CollisionBlock({
                    position: {
                        x: (i % 39) * 36,
                        y: Math.floor(i / 39) * 36,
                    },
                    shape: shape,
                    direction: direction,
                })
            );
        }
    }

    return objects;
}
