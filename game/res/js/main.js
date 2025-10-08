import { playGame } from "./game.js";
import {
    loadData,
    loadDataFromLocalStorage,
    menuActive,
    setCanClick,
    setGameType,
    setPickedCharacter,
} from "./helpers.js";
import { socket } from "./online.js";

// window.onload = async () => {
//     await loadData();
//     loadDataFromLocalStorage();
//     playGame();
// };

export async function startOfflineGame() {
    setGameType("offline");

    await loadData();
    loadDataFromLocalStorage();
    playGame();
}

export async function startOnlineGame() {
    setGameType("online");
    setCanClick(socket.playerInfo.leader);
    console.log(socket.playerInfo.character);
    console.log(socket.playerInfo);
    console.log(menuActive);
    
    
    setPickedCharacter(socket.playerInfo.character);

    await loadData();
    playGame();
}
