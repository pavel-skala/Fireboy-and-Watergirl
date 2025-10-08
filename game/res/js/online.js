import { menuActive, nickname, setMenuActive, setRoomDeleted } from "./helpers.js";
import { startOfflineGame, startOnlineGame } from "./main.js";
import { drawWelcomeMenu } from "./menu/canvas.js";
import { addClickListener, drawDisconnectedMenu, drawRoomsMenu, drawWaitingMenu, tableClickListener } from "./menu/onlineMenu.js";


export const socket = io();
socket.on("connect", () => {
    console.log("Connected to server");
    drawWelcomeMenu();
});

socket.on("updateRoomList", (newRooms) => {
    rooms = newRooms;

    // console.log(rooms);
    console.log(menuActive);
    if (menuActive === "roomsMenu") {
        drawRoomsMenu();
    } else if (menuActive === "waitingMenu") {
        drawWaitingMenu(null);
    }
});

socket.on("roomCreated", (room) => {
    savePlayerInfo(room.players[0]);
});

let countdownIntervalJoinedRoom

socket.on("roomJoined", (room) => {
    if (!socket.playerInfo) {
        savePlayerInfo(room.players[1]);
    }

    let countdown = 5;
    drawWaitingMenu(countdown);

    countdownIntervalJoinedRoom = setInterval(() => {
        countdown--;

        if (countdown == 0) {
            clearInterval(countdownIntervalJoinedRoom);
            setMenuActive("mainMenu")
            startOnlineGame(socket);
        } else {
            drawWaitingMenu(countdown);
        }
    }, 1000);


});

socket.on("deleteRoom", (room) => {
    console.log(room);
    let teamMate = room.players.find((player) => player.nickname !== nickname);
    if (!teamMate) {
        teamMate = room.players[0];
    }
    console.log(teamMate);

    setRoomDeleted(true)
    
    clearInterval(countdownIntervalJoinedRoom);
    

    let countdown = 5;
    drawDisconnectedMenu(countdown, teamMate.nickname);

    let countdownInterval = setInterval(() => {
        countdown--;

        if (countdown == 0) {
            clearInterval(countdownInterval);
            window.location.reload()
            addClickListener(tableClickListener);
            setMenuActive("roomsMenu")
            drawRoomsMenu();
        } else {
            drawDisconnectedMenu(countdown, teamMate.nickname);
        }
    }, 1000);


    // disconnectSection.style.display = "flex";
    // waitingSection.style.display = "none";
    // canvas.style.display = "none";
    // document.body.style.backgroundColor = "white";

    // console.log(room);
    // let teamMate = room.players.find((player) => player.nickname !== nickname);
    // if (!teamMate) {
    //     teamMate = room.players[0];
    // }
    // console.log(teamMate);
    // disconnectNickname.textContent = teamMate.nickname;

    // let countdown = 5;

    // let countdownInterval = setInterval(() => {
    //     countdown--;
    //     disconnectCountdown.textContent = countdown;

    //     if (countdown == 0) {
    //         clearInterval(countdownInterval);
    //         disconnectSection.style.display = "none";
    //         roomsSection.style.display = "flex";
    //     }
    // }, 1000);
});


let rooms = {};


// window.onbeforeunload = () => {
//     return "Are you sure you want to leave?";
// }



function savePlayerInfo(player) {
    socket.playerInfo = player;
}

export { rooms };
