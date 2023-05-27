

// initialize client socket
const socket = io();


// querying html elements
let app = document.getElementById("app");
let rooms = document.querySelector(".rooms");
let input = document.querySelector("input.name");
let pName = document.querySelector("input#id");
let joinBtn = document.querySelector("button.join");

let room = document.querySelector(".room");
let board = document.querySelector(".board");
let sideOne = document.querySelector(".one");
let sideTwo = document.querySelector(".two");
let playerName = document.querySelector(".enemy");
let choices = document.querySelectorAll(".choices button");
let card = document.createElement('span');
let playerPlayed = document.createElement("h1");
let another = document.createElement("button");
another.innerText = "play more";
another.classList.add("another");
let h1 = document.createElement("h1");
h1.classList.add('win');
let wantAnotherAlert = document.createElement("h1");


// important variables
let roomName = '';
let myName = '';
let myMove = '';
let enemyMove = [];
let choicesIco = {
    rock: `
    <?xml version="1.0" ?><svg viewBox="0 0 512 512"
                                xmlns="http://www.w3.org/2000/svg"><path
                                    d="M408.864 79.052c-22.401-33.898-66.108-42.273-98.813-23.588-29.474-31.469-79.145-31.093-108.334-.022-47.16-27.02-108.71 5.055-110.671 60.806C44.846 105.407 0 140.001 0 187.429v56.953c0 32.741 14.28 63.954 39.18 85.634l97.71 85.081c4.252 3.702 3.11 5.573 3.11 32.903 0 17.673 14.327 32 32 32h252c17.673 0 32-14.327 32-32 0-23.513-1.015-30.745 3.982-42.37l42.835-99.656c6.094-14.177 9.183-29.172 9.183-44.568V146.963c0-52.839-54.314-88.662-103.136-67.911zM464 261.406a64.505 64.505 0 0 1-5.282 25.613l-42.835 99.655c-5.23 12.171-7.883 25.04-7.883 38.25V432H188v-10.286c0-16.37-7.14-31.977-19.59-42.817l-97.71-85.08C56.274 281.255 48 263.236 48 244.381v-56.953c0-33.208 52-33.537 52 .677v41.228a16 16 0 0 0 5.493 12.067l7 6.095A16 16 0 0 0 139 235.429V118.857c0-33.097 52-33.725 52 .677v26.751c0 8.836 7.164 16 16 16h7c8.836 0 16-7.164 16-16v-41.143c0-33.134 52-33.675 52 .677v40.466c0 8.836 7.163 16 16 16h7c8.837 0 16-7.164 16-16v-27.429c0-33.03 52-33.78 52 .677v26.751c0 8.836 7.163 16 16 16h7c8.837 0 16-7.164 16-16 0-33.146 52-33.613 52 .677v114.445z" /></svg>
    `,
    paper: `
    <?xml version="1.0" ?><svg viewBox="0 0 448 512"
                                xmlns="http://www.w3.org/2000/svg"><path
                                    d="M372.57 112.641v-10.825c0-43.612-40.52-76.691-83.039-65.546-25.629-49.5-94.09-47.45-117.982.747C130.269 26.456 89.144 57.945 89.144 102v126.13c-19.953-7.427-43.308-5.068-62.083 8.871-29.355 21.796-35.794 63.333-14.55 93.153L132.48 498.569a32 32 0 0 0 26.062 13.432h222.897c14.904 0 27.835-10.289 31.182-24.813l30.184-130.958A203.637 203.637 0 0 0 448 310.564V179c0-40.62-35.523-71.992-75.43-66.359zm27.427 197.922c0 11.731-1.334 23.469-3.965 34.886L368.707 464h-201.92L51.591 302.303c-14.439-20.27 15.023-42.776 29.394-22.605l27.128 38.079c8.995 12.626 29.031 6.287 29.031-9.283V102c0-25.645 36.571-24.81 36.571.691V256c0 8.837 7.163 16 16 16h6.856c8.837 0 16-7.163 16-16V67c0-25.663 36.571-24.81 36.571.691V256c0 8.837 7.163 16 16 16h6.856c8.837 0 16-7.163 16-16V101.125c0-25.672 36.57-24.81 36.57.691V256c0 8.837 7.163 16 16 16h6.857c8.837 0 16-7.163 16-16v-76.309c0-26.242 36.57-25.64 36.57-.691v131.563z" /></svg>
    `,
    scissors: `
    <svg xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"><!--! Font Awesome Free 6.0.0-beta2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path
                                    d="M270.1 480h97.92C447.4 480 512 417.1 512 339.7V231.8c0-23.45-6.106-46.73-17.66-67.33l-31.35-55.85C447.5 81.1 417.1 64 385.9 64h-46.97c-26.63 0-51.56 11.63-68.4 31.93l-15.46 18.71L127.3 68.44C119 65.46 110.5 64.05 102.1 64.05c-30.02 0-58.37 18.06-69.41 47.09C15.06 156.8 46.19 194 76.75 204.9l2.146 .7637L68.79 206.4C30.21 209 0 241.2 0 279.3c0 39.7 33.27 72.09 73.92 72.09c1.745 0 3.501-.0605 5.268-.1833l88.79-6.135v8.141c0 22.11 10.55 43.11 28.05 56.74C197.4 448.8 230.2 480 270.1 480zM269.1 432c-14.34 0-26-11.03-26-24.62c0 0 .0403-14.31 .0403-14.71c0-6.894-4.102-14.2-10.67-16.39c-10.39-3.5-17.38-12.78-17.38-23.06v-13.53c0-16.98 13.7-16.4 13.7-29.89c0-9.083-7.392-15.96-15.96-15.96c-.3646 0-.7311 .0125-1.099 .0377c0 0-138.1 9.505-138.7 9.505c-14.32 0-25.93-11.04-25.93-24.49c0-13.28 10.7-23.74 24.1-24.64l163.2-11.28c2.674-.1882 14.92-2.907 14.92-16.18c0-6.675-4.284-12.58-10.65-14.85L92.84 159.7C85.39 156.1 75.97 149.4 75.97 136.7c0-11.14 9.249-24.66 25.97-24.66c3.043 0 6.141 .5115 9.166 1.59l234.1 85.03c1.801 .6581 3.644 .9701 5.456 .9701c8.96 0 16-7.376 16-15.1c0-6.514-4.068-12.69-10.59-15.04l-64.81-23.47l15.34-18.56C315.2 117.3 326.6 112 338.9 112h46.97c14.77 0 28.28 7.719 35.27 20.16L452.5 188c7.531 13.41 11.52 28.56 11.52 43.81v107.9c0 50.91-43.06 92.31-96 92.31H269.1z" /></svg>
    `
}


// handle room join




socket.on("connect", () => {

    joinBtn.addEventListener('click', () => {
        if (input.value && pName.value) {
            roomName = input.value;
            myName = pName.value;
            socket.emit("join-room", roomName, myName);


        } else {
            alert("fill all fields !");
        }
    })


    socket.on('you-joined', (pName) => {
        if (pName) {
            playerName.innerText = pName;
        }
        rooms.classList.add("none");
        room.classList.remove("none");
    })


    socket.on("joined", (pName) => {
        playerName.innerText = pName;
    })

    socket.on("room-full", () => {
        alert("the room is full, try another room");
    })

    choices.forEach(c => {
        c.addEventListener("click", () => {
            c.classList.add("chosen");
            myMove = c.id;
            socket.emit("player-played", c.id, roomName, myName);
        })
    })

    socket.on("player-played", (class_, choice, pName) => {

        card.classList.add(class_);
        playerPlayed.innerText = pName + ' has played';
        playerPlayed.classList.add(class_);
        sideTwo.appendChild(card);
        sideTwo.appendChild(playerPlayed);
        enemyMove = choice;

    })

    socket.on('result', (result) => {
        h1.innerText = result === myName ? "You Win" : result;
        card.innerHTML = choicesIco[enemyMove];
        app.classList.add("opacity");
        document.body.appendChild(h1);
        document.body.appendChild(another);

    })


    another.addEventListener("click", () => {
        socket.emit("another-game", myName, roomName);
    })

    socket.on("want-another", (sName) => {

        wantAnotherAlert.innerText = sName + " wants to play more once";
        wantAnotherAlert.classList.add('want-another');
        document.body.appendChild(wantAnotherAlert);
        socket.emit("got-request", roomName);
    })

    socket.on("wait-response", () => {
        wantAnotherAlert.innerText = "request has been sent, wait for response";
        wantAnotherAlert.classList.add('want-another');
        document.body.appendChild(wantAnotherAlert);
    })

    socket.on("wait-refresh", () => {
        wantAnotherAlert.innerText = "wait untile someone enters the room or refresh the game";
        wantAnotherAlert.classList.add('want-another');
        document.body.appendChild(wantAnotherAlert);
    })

    socket.on("leaved", () => {
        playerName.innerText = "empty";
    })

    socket.on("reset", () => {
        if (document.body.querySelector('.want-another')) {
            document.body.removeChild(wantAnotherAlert);

        }
        document.body.removeChild(h1);
        document.body.removeChild(another);
        sideTwo.removeChild(card);
        sideTwo.removeChild(playerPlayed);
        card.innerHTML = '';
        app.classList.remove("opacity");
        choices.forEach(c => {
            c.classList.remove("chosen");
        })
    });

});

