const collisionsLevel1 = [
    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0,
    0, 0, 0, 0, 0, 2, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1,
    1, 3, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0,
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
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 1, 1, 1, 1, 1, 1, 13, 12, 12, 12, 14, 1, 1, 1, 1, 3, 0, 0,
    0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 5, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 6, 6, 6, 8, 1, 1, 1,
    10, 9, 9, 9, 11, 1, 1, 1, 1, 0, 0, 0, 0,
];

class CollisionBlock {
    constructor({ position, shape, direction, element }) {
        this.position = position;
        this.shape = shape;
        this.direction = direction;
        this.height = 36;
        this.width = 36;
        this.element = element;
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
    const ponds = [];

    for (let i = 0; i < array.length; i++) {
        let shape;
        let direction = {
            x: null,
            y: null,
        };
        let element = null;
        let flipImage = false;
        let currentRow;

        switch (array[i]) {
            case 1:
                //square
                shape = "square";
                break;
            case 2:
                //triangle to left
                shape = "triangle";
                direction = {
                    x: "left",
                    y: "up",
                };
                break;
            case 3:
                //triangle to right
                shape = "triangle";
                direction = {
                    x: "right",
                    y: "up",
                };
                break;
            case 4:
                //triangle to left
                shape = "triangle";
                direction = {
                    x: "left",
                    y: "down",
                };
                break;
            case 5:
                //triangle to right
                shape = "triangle";
                direction = {
                    x: "right",
                    y: "down",
                };
                break;
            case 6:
            case 9:
            case 12:
                shape = "pond";
                break;
            case 7:
            case 10:
            case 13:
                //pond triangle to right
                shape = "pondTriangle";
                direction = {
                    x: "right",
                    y: "up",
                };
                border = "border";
                break;
            case 8:
            case 11:
            case 14:
                //pond triangle to left
                shape = "pondTriangle";
                direction = {
                    x: "left",
                    y: "up",
                };
                border = "border";
                flipImage = true;
                break;
        }
        switch (array[i]) {
            case 6:
                element = "fire";
                currentRow = 3;
                break;
            case 7:
            case 8:
                element = "fire";
                currentRow = 4;
                break;
            case 9:
                currentRow = 1;
                element = "water";
                break;
            case 10:
            case 11:
                element = "water";
                currentRow = 2;
                break;
            case 12:
                element = "acid";
                currentRow = 5;
                break;
            case 13:
            case 14:
                element = "acid";
                currentRow = 6;
                break;
        }

        if (6 <= array[i]) {
            ponds.push(
                new Sprite({
                    position: {
                        x: (i % 39) * 36,
                        y: Math.floor(i / 39) * 36,
                    },
                    // imgSrc: `./res/img/ponds/${element}${border}.png`,
                    imgSrc: `./res/img/ponds.png`,
                    frameRate: 9,
                    imgRows: 6,
                    currentRow: currentRow,
                    flipImage: flipImage,
                })
            );
        }

        if (array[i] !== 0) {
            objects.push(
                new CollisionBlock({
                    position: {
                        x: (i % 39) * 36,
                        y: Math.floor(i / 39) * 36,
                    },
                    shape: shape,
                    direction: direction,
                    element: element,
                })
            );
        }
    }

    return [objects, ponds];
}
