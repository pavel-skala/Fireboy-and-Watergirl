import {
    ctx,
    getMousePos,
    menuActive,
    nickname,
    randomId,
    setMenuActive,
    setNickname,
} from "../helpers.js";
import { rooms, socket } from "../online.js";
import { checkButtonCollision, menuButtons } from "./buttons.js";
import {
    drawArrow,
    drawImage,
    drawMenuBackground,
    drawTableUnderline,
    drawText,
} from "./canvas.js";

let newNickname = "";
let condition = "";

function drawNicknameMenu() {
    drawMenuBackground();

    drawText("Enter your nickname", 400, 200, 50, "yellow");

    for (const btnName in menuButtons.nicknameMenu) {
        menuButtons.nicknameMenu[btnName].draw();
    }

    drawText(newNickname, 450, 310, 50, "yellow");
    drawText(condition, 500, 400, 30, "red");

    drawArrow(320, 300, "yellow");
}

function addKeyDownListener() {
    window.addEventListener("keydown", handleKeyDown);
}

function handleKeyDown(e) {
    if (menuActive != "nicknameMenu") return;

    if (e.key == "Backspace") {
        if (newNickname.length > 0) {
            newNickname = newNickname.slice(0, -1);
        }
    }

    if (
        (e.keyCode >= 65 && e.keyCode <= 90) ||
        (e.keyCode >= 48 && e.keyCode <= 57) ||
        (e.keyCode >= 96 && e.keyCode <= 105)
    ) {
        newNickname += e.key.toLowerCase();
    }

    drawNicknameMenu();
}

function submitNickname() {
    if (newNickname.length > 10) {
        condition = "Maximum 10 characters";
        drawNicknameMenu();
        return;
    }
    if (newNickname.length == 0) {
        condition = "Please enter a nickname";
        drawNicknameMenu();
        return;
    }
    if (newNickname.length < 3) {
        condition = "Minimum 3 characters";
        drawNicknameMenu();
        return;
    }

    console.log(newNickname);
    setNickname(newNickname);
    setMenuActive("roomsMenu");
    window.removeEventListener("keydown", handleKeyDown);

    addClickListener(tableClickListener);
    drawRoomsMenu();
}

function drawRoomsMenu() {
    drawMenuBackground();

    drawText("Rooms", 600, 200, 50, "yellow");

    for (const btnName in menuButtons.roomsMenu) {
        menuButtons.roomsMenu[btnName].draw();
    }

    drawSelectedRoom();

    drawRoomsTable(rooms);

    drawText(`Page ${currentPage}`, 650, 660, 30, "yellow");
}

let table = {
    headers: ["Room ID", "Player 1 (Leader)", "Player 2"],
    position: {
        x: [200, 550, 1000],
        y: 300,
    },
    items: {
        position: {
            x: 200,
            y: [315, 375, 435, 495, 555],
        },
        width: 1000,
        height: 60,
    },
};

// let rooms = {
//     123: {
//         id: 123,
//         players: [
//             {
//                 nickname: "Player 1",
//                 leader: true,
//                 character: "fireboy",
//             },
//             {
//                 nickname: "Player 3",
//                 leader: false,
//                 character: "watergirl",
//             }
//         ],
//     },
//     456: {
//         id: 456,
//         players: [
//             {
//                 nickname: "Player 2",
//                 leader: false,
//                 character: "watergirl",
//             },
//         ],
//     },
//     459: {
//         id: 459,
//         players: [
//             {
//                 nickname: "Player 2",
//                 leader: false,
//                 character: "watergirl",
//             },
//         ],
//     },
//     111: {
//         id: 111,
//         players: [
//             {
//                 nickname: "Player 2",
//                 leader: false,
//                 character: "watergirl",
//             },
//         ],
//     },
//     222: {
//         id: 222,
//         players: [
//             {
//                 nickname: "Player 2",
//                 leader: false,
//                 character: "watergirl",
//             },
//         ],
//     },
//     333: {
//         id: 333,
//         players: [
//             {
//                 nickname: "Player 2",
//                 leader: false,
//                 character: "watergirl",
//             },
//         ],
//     },
//     444: {
//         id: 444,
//         players: [
//             {
//                 nickname: "Player 2",
//                 leader: false,
//                 character: "watergirl",
//             },
//         ],
//     },
//     127: {
//         id: 123,
//         players: [
//             {
//                 nickname: "Player 1",
//                 leader: true,
//                 character: "fireboy",
//             },
//         ],
//     },
// };

const ROOM_PER_PAGE = 5;
let currentPage = 1;

function drawRoomsTable(tableRooms) {
    table.headers.forEach((header, index) => {
        drawText(header, table.position.x[index], table.position.y, 30, "yellow");
    });

    drawTableUnderline(table.position.y + 15);

    let pageRoomIds = getPageRoomsIds(tableRooms);

    pageRoomIds.forEach((roomId, index) => {
        let y = table.position.y + (index + 1) * 60;
        drawText(roomId, table.position.x[0], y, 30, "yellow");

        tableRooms[roomId].players.forEach((player, index) => {
            drawImage(characters[player.character].headSrc, table.position.x[index + 1] - 50, y - 40);
            drawText(player.nickname, table.position.x[index + 1], y, 30, "yellow");
        });

        drawTableUnderline(y + 15);
    });
}

function getPageRoomsIds(pageRooms) {
    let roomIds = Object.keys(pageRooms);
    let start = ROOM_PER_PAGE * (currentPage - 1);
    let end = start + ROOM_PER_PAGE;
    let pageRoomIds = roomIds.slice(start, end);

    return pageRoomIds;
}

function addClickListener(functionName) {
    window.addEventListener("click", functionName);
}

let selectedRoom = null;

function drawSelectedRoom() {
    if (!selectedRoom) return;

    ctx.fillStyle = "black";
    ctx.fillRect(selectedRoom.x, selectedRoom.y, selectedRoom.width, selectedRoom.height);
}

function tableClickListener(e) {
    let pos = getMousePos(e);

    if (
        pos.x >= table.items.position.x &&
        pos.x <= table.items.position.x + table.items.width &&
        pos.y >= table.items.position.y[0] &&
        pos.y <= table.items.position.y[4] + table.items.height
    ) {
        let pageRoomIds = getPageRoomsIds(rooms);
        for (let i = 0; i < pageRoomIds.length; i++) {
            let y = table.items.position.y[i];

            if (pos.y >= y && pos.y <= y + table.items.height) {
                let roomId = pageRoomIds[i];
                if (rooms[roomId].players.length <= 1) {
                    selectedRoom = {
                        id: roomId,
                        x: table.items.position.x,
                        y: y,
                        width: table.items.width,
                        height: table.items.height,
                    };
                    drawRoomsMenu();
                }
            }
        }
    }
}

function nextPage() {
    let roomIds = Object.keys(rooms);
    if (currentPage * ROOM_PER_PAGE < roomIds.length) {
        currentPage++;
        // drawRoomsTable(rooms);
        selectedRoom = null;
        drawRoomsMenu();
    }
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        // drawRoomsTable(rooms);
        selectedRoom = null;
        drawRoomsMenu();
    }
}

function createBtnOnClick() {
    setMenuActive("pickCharacterMenu");
    window.removeEventListener("click", tableClickListener);
    addClickListener(pickCharacterClickListener);
    drawPickCharacterMenu();
}

function joinRoomBtnOnClick() {
    if (!selectedRoom) return;
    joinedRoomId = selectedRoom.id;

    window.removeEventListener("click", tableClickListener);

    socket.emit("joinRoom", selectedRoom.id, nickname);
    setMenuActive("waitingMenu");
    drawWaitingMenu(null);
}

// Pick character menu
function drawPickCharacterMenu() {
    drawMenuBackground();

    drawText("Pick your character", 400, 200, 50, "yellow");

    for (const btnName in menuButtons.pickCharacterMenu) {
        menuButtons.pickCharacterMenu[btnName].draw();
    }

    for (const chr in characters) {
        let character = characters[chr];
        drawImage(character.src, character.position.x, character.position.y);
    }
}

const characters = {
    fireboy: {
        position: {
            x: 500,
            y: 300,
        },
        width: 36,
        height: 50,
        src: "./res/img/menu/fireboy.png",
        headSrc: "./res/img/menu/fireboy_head.png",
    },
    watergirl: {
        position: {
            x: 800,
            y: 300,
        },
        width: 36,
        height: 50,
        src: "./res/img/menu/watergirl.png",
        headSrc: "./res/img/menu/watergirl_head.png",
    },
};

function pickCharacterClickListener(e) {
    let pos = getMousePos(e);

    for (const character in characters) {
        if (checkButtonCollision(pos, characters[character])) {
            window.removeEventListener("click", pickCharacterClickListener);
            createNewRoom(character);
        }
    }
}

let joinedRoomId;

function createNewRoom(character) {
    let roomId = randomId(rooms);
    console.log(roomId);
    joinedRoomId = roomId;
    socket.emit("createRoom", roomId, nickname, character);

    setMenuActive("waitingMenu");
    drawWaitingMenu(null);
}

function drawWaitingMenu(countdown) {
    drawMenuBackground();

    let text = "Waiting for player...";

    if (countdown) {
        text = `Game starting in ${countdown}...`;
    }
    drawText(text, 400, 200, 50, "yellow");

    let joinedRoom = {
        [joinedRoomId]: rooms[joinedRoomId],
    };
    console.log(joinedRoom);
    
    if (rooms[joinedRoomId]) {
        drawRoomsTable(joinedRoom);
    }
}

function drawDisconnectedMenu(countdown, teamMateNickname) {
    drawMenuBackground();
 

    let text = `Player ${teamMateNickname} disconnected...`;

    drawText(text, 300, 300, 50, "yellow");

    text = `Redirecting back in ${countdown}...`;

    drawText(text, 400, 400, 50, "yellow");
}

export {
    drawNicknameMenu,
    submitNickname,
    addKeyDownListener,
    table,
    nextPage,
    previousPage,
    createBtnOnClick,
    joinRoomBtnOnClick,
    drawRoomsMenu,
    addClickListener,
    tableClickListener,
    drawWaitingMenu,
    drawDisconnectedMenu
};
