import { playGame } from "./game.js";
import { loadData } from "./helpers.js";

window.onload = async () => {
    await loadData();
    playGame();
};
