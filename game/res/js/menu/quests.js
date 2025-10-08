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
            JSON.stringify(this.requirement.variable) ==
            JSON.stringify(this.requirement.required)
        ) {
            this.status.currentRow = 2;
            this.completed = true;
            return;
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

quests.finalDiamond = new Quest({
    position: {
        x: 450,
        y: 550,
    },
    offsetY: 285,
    currentRow: 3,
    requirement: {
        variable: allDiamonds,
        getVariable: () => {
            return allDiamonds;
        },
        required: [],
    },
});

export { quests };
