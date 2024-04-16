import { playGame } from "./game.js";
import { loadData, loadDataFromLocalStorage } from "./helpers.js";

window.onload = async () => {
    await loadData();
    loadDataFromLocalStorage();
    playGame();
};
