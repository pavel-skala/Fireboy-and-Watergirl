import { allDiamonds, ctx, levelCompleted } from "../helpers.js";
import { Sprite } from "../sprite.js";

class Quest {
    constructor({ position, offsetY, requirement, currentRow }) {
        this.position = position;
        this.requirement = requirement;
        this.offsetY = offsetY;

        this.quest = new Sprite({
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            imgSrc: "./res/img/quests.png",
            imgRows: 3,
            currentRow: currentRow,
        });

        this.status = new Sprite({
            position: {
                x: this.position.x + 100,
                y: this.position.y,
            },
            imgSrc: "./res/img/status.png",
            imgRows: 2,
            currentRow: 1,
        });

        this.completed = false;
    }
    setVariable() {
        this.requirement.variable = this.requirement.getVariable();
    }
    check() {
        if (
            JSON.stringify(this.requirement.variable) == JSON.stringify(this.requirement.required)
        ) {
            this.status.currentRow = 2;
            this.completed = true;
            return
        }

        this.status.currentRow = 1;
        this.completed = false;
    }
    updatePositionY(menuPos) {
        this.quest.position.y = menuPos + this.offsetY;
        this.status.position.y = menuPos + this.offsetY;
    }
    draw() {
        this.quest.draw();
        this.status.draw();
    }
}

function drawArrow(menuPos) {
    let startX = 700;
    let startY = menuPos + 310;
    let size = 100;
    let arrowX = startX + 0.75 * size;
    let arrowTopY = startY - 0.707 * (0.25 * size);
    let arrowBottomY = startY + 0.707 * (0.25 * size);

    ctx.strokeStyle = "#fac702";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + size, startY);
    ctx.moveTo(startX + size + 1, startY + 3);
    ctx.lineTo(arrowX, arrowTopY);
    ctx.moveTo(startX + size + 1, startY - 3);
    ctx.lineTo(arrowX, arrowBottomY);
    ctx.stroke();
}

let quests = {};

quests.levelCompleted = new Quest({
    position: {
        x: 450,
        y: 500,
    },
    offsetY: 220,
    currentRow: 1,
    requirement: {
        variable: levelCompleted,
        getVariable: () => {
            return levelCompleted;
        },
        required: true,
    },
});

quests.allDiamonds = new Quest({
    position: {
        x: 450,
        y: 600,
    },
    offsetY: 350,
    currentRow: 2,
    requirement: {
        variable: allDiamonds,
        getVariable: () => {
            return allDiamonds;
        },
        required: [],
    },
});

export { drawArrow, quests };
