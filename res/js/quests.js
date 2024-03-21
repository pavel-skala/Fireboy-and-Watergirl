import { ctx } from "./helpers.js";
import { Sprite } from "./sprite.js";

export class Quest {
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
            imgRows: 2,
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

        this.completed = false
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
            this.completed = true
        }
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
