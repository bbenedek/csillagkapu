document.addEventListener("DOMContentLoaded", function () {
    const grid = document.querySelector(".grid");
    const width = 5;
    const numberOfPlaneParts = 3;
    const numberOfClues = numberOfPlaneParts * 2;
    let numberOfActionsLeft = 3;
    let squares = [];
    let dugTiles = [];
    let playerPosition = { x: 2, y: 2 };
    let currentPlayerPosition;
    let selectedAction = null; // Variable to track the selected action

    const oasisArray = ["oasis", "oasis", "oasis", "mirage"];
    const planePartsArray = ["planePart1", "planePart2", "planePart3"];
    const cluesArray = [
        "rowClue1",
        "columnClue1",
        "rowClue2",
        "columnClue2",
        "rowClue3",
        "columnClue3",
    ];
    let planePartsData = {
        planePart1: {
            rowClue: null,
            columnClue: null,
            imgSrc: "/Assets/Item1.png",
            rowClueSrc: "/Assets/clue1row.png",
            columnClueSrc: "/Assets/clue1col.png",
        },
        planePart2: {
            rowClue: null,
            columnClue: null,
            imgSrc: "/Assets/Item2.png",
            rowClueSrc: "/Assets/clue2row.png",
            columnClueSrc: "/Assets/clue2col.png",
        },
        planePart3: {
            rowClue: null,
            columnClue: null,
            imgSrc: "/Assets/Item3.png",
            rowClueSrc: "/Assets/clue3row.png",
            columnClueSrc: "/Assets/clue3col.png",
        },
    };

    const emptyArray = Array(
        width * width -
            oasisArray.length -
            planePartsArray.length -
            cluesArray.length -
            1
    ).fill("empty");

    const gameArray = oasisArray.concat(
        planePartsArray,
        cluesArray,
        emptyArray
    );

    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);
    const middleIndex = Math.floor((width * width) / 2);
    shuffledArray.splice(middleIndex, 0, "startPosition");

    function createSquaresMatrix(shuffledArray) {
        for (let i = 0; i < width; i++) {
            const row = [];
            for (let j = 0; j < width; j++) {
                const index = i * width + j;
                row.push(shuffledArray[index]);
            }
            squares.push(row);
        }

        for (let i = 0; i < width; i++) {
            for (let j = 0; j < width; j++) {
                if (squares[i][j].startsWith("planePart")) {
                    const planePartNumber = squares[i][j].slice(-1);
                    planePartsData[`planePart${planePartNumber}`].rowClue =
                        j + 1;
                    planePartsData[`planePart${planePartNumber}`].columnClue =
                        i + 1;
                }
            }
        }

        for (let i = 0; i < width; i++) {
            for (let j = 0; j < width; j++) {
                if (squares[i][j].startsWith("rowClue")) {
                    const clueNumber = squares[i][j].slice(-1);
                    squares[i][j] +=
                        "-" + planePartsData[`planePart${clueNumber}`].rowClue;
                }
            }
        }

        for (let i = 0; i < width; i++) {
            for (let j = 0; j < width; j++) {
                if (squares[i][j].startsWith("columnClue")) {
                    const clueNumber = squares[i][j].slice(-1);
                    squares[i][j] +=
                        "-" +
                        planePartsData[`planePart${clueNumber}`].columnClue;
                }
            }
        }
    }

    let players = []; // Array to store player objects

    // Function to add a new player
    function addPlayer() {
        const playerName = "Bela"; // Change to prompt("Enter player's name:");
        if (playerName) {
            const newPlayer = {
                name: playerName,
                actionsLeft: 3, // Initial actions left
                bottlesOfWater: 6, // Initial bottles of water left
            };
            players.push(newPlayer);
            console.log(`Player ${playerName} added.`);
        } else {
            console.log("Player name cannot be empty.");
        }
    }

    // Example usage:
    addPlayer(); // Call this function whenever you want to add a new player

    // After collecting player data
    function playerData() {
        const playerInfoContainer = document.getElementById(
            "playerInfoContainer"
        );

        // Clear any existing content in the container
        playerInfoContainer.innerHTML = "";

        // Loop through the player data and create elements to display it
        for (let i = 0; i < players.length; i++) {
            const playerDiv = document.createElement("div");
            playerDiv.classList.add("player-info");

            const playerName = document.createElement("h2");
            playerName.textContent = `Player ${i + 1}: ${players[i].name}`;

            const actionsLeft = document.createElement("p");
            actionsLeft.textContent = `Actions left: ${players[i].actionsLeft}`;

            const waterBottles = document.createElement("p");
            waterBottles.textContent = `Water bottles left: ${players[i].bottlesOfWater}`;

            playerDiv.appendChild(playerName);
            playerDiv.appendChild(actionsLeft);
            playerDiv.appendChild(waterBottles);

            playerInfoContainer.appendChild(playerDiv);
        }
    }

    function createBoard() {
        for (let i = 0; i < width; i++) {
            const row = document.createElement("div");
            grid.appendChild(row);

            for (let j = 0; j < width; j++) {
                const square = document.createElement("div");
                square.setAttribute("id", "sq" + (i * width + j));

                const img = document.createElement("img");

                if (squares[i][j] === "oasis" || squares[i][j] === "mirage") {
                    img.setAttribute("src", "/Assets/Oasis_marker.png");
                    img.setAttribute("class", "oasis-marker");
                    square.appendChild(img);
                } else if (i * width + j === middleIndex) {
                    img.setAttribute("src", "/Assets/Stargate.png");
                    square.appendChild(img);
                } else {
                    img.setAttribute("src", "/Assets/background.png");
                    img.setAttribute("class", "background");
                    square.appendChild(img);
                }
                if (playerPosition.x === j && playerPosition.y === i) {
                    square.setAttribute(
                        "id",
                        "sq" + (i * width + j) + "-player1"
                    );
                    const playerImg = document.createElement("img");
                    playerImg.setAttribute("src", "/Assets/Player.png");
                    playerImg.setAttribute("id", "playerImg");
                    square.appendChild(playerImg);
                }
                square.classList.add(squares[i][j]);

                row.appendChild(square);
            }
        }
    }

    createSquaresMatrix(shuffledArray);
    createBoard();
    playerData();

    function isAdjacent(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2) === 1;
    }

    function movePlayer(newX, newY) {
        const currentPlayerSquare = document.getElementById(
            `sq${playerPosition.y * width + playerPosition.x}-player1`
        );
        currentPlayerSquare.setAttribute(
            "id",
            `sq${playerPosition.y * width + playerPosition.x}`
        );
        const playerImg = document.getElementById("playerImg");
        playerImg.remove();

        playerPosition.x = newX;
        playerPosition.y = newY;

        const newPlayerSquare = document.getElementById(
            `sq${newY * width + newX}`
        );
        newPlayerSquare.setAttribute("id", `sq${newY * width + newX}-player1`);

        const newPlayerImg = document.createElement("img");
        newPlayerImg.setAttribute("src", "/Assets/Player.png");
        newPlayerImg.setAttribute("id", "playerImg");

        newPlayerSquare.appendChild(newPlayerImg);
    }

    function dig(clickedX, clickedY) {
        console.log(`You chose to DIG at (${clickedX}, ${clickedY}).`);
        const currentPlayerTile = squares[clickedY][clickedX];
        const currentSquare = document.querySelector(
            `[id^=sq${clickedY * width + clickedX}]`
        );
        const markerImg = currentSquare.querySelector(".oasis-marker");
        const tileImg = currentSquare.querySelector(".background");

        if (markerImg) {
            if (currentPlayerTile === "oasis") {
                markerImg.src = "/Assets/Oasis.png";
            } else if (currentPlayerTile === "mirage") {
                markerImg.src = "/Assets/Drought.png";
            }
            players[0].actionsLeft--;
        } else if (tileImg) {
            if (!dugTiles.includes(`${clickedX},${clickedY}`)) {
                if (currentPlayerTile.startsWith("planePart")) {
                    const planePartNumber = currentPlayerTile.slice(-1);
                    tileImg.src =
                        planePartsData[`planePart${planePartNumber}`].imgSrc;
                    tileImg.style.opacity = 1;
                } else if (currentPlayerTile === "empty") {
                    currentSquare.classList.add("dug");
                }
                dugTiles.push(`${clickedX},${clickedY}`);

                players[0].actionsLeft--;

                if (players[0].bottlesOfWater === 0) {
                    console.log("Game Over! You ran out of water bottles.");
                }
            } else {
                console.log("This tile has already been dug.");
            }
        }
    }

    grid.addEventListener("click", function (event) {
        const clickedElement = event.target;

        if (clickedElement.tagName === "IMG" || clickedElement.closest("img")) {
            const parentSquare = clickedElement.closest("div");
            if (parentSquare) {
                const index = parentSquare.id.replace("sq", "");
                const clickedIndex = parseInt(index);
                const clickedX = clickedIndex % width;
                const clickedY = Math.floor(clickedIndex / width);

                if (players[0].actionsLeft > 0) {
                    if (
                        isAdjacent(
                            playerPosition.x,
                            playerPosition.y,
                            clickedX,
                            clickedY
                        )
                    ) {
                        movePlayer(clickedX, clickedY);
                        players[0].actionsLeft--;
                        playerData();
                        if (players[0].actionsLeft === 0) {
                            players[0].bottlesOfWater--;
                            players[0].actionsLeft = 3;
                            playerData();
                            if (players[0].bottlesOfWater === 0) {
                                console.log(
                                    "Game Over! You ran out of water bottles."
                                );
                            }
                        }
                    } else {
                        console.log("You can only move to adjacent tiles.");
                    }
                } else {
                    console.log("You have no more actions left.");
                }
            }
        } else {
            const index = clickedElement.id.replace("sq", "");
            const clickedIndex = parseInt(index);
            const clickedX = clickedIndex % width;
            const clickedY = Math.floor(clickedIndex / width);

            if (players[0].actionsLeft > 0 && selectedAction !== null) {
                if (selectedAction === "dig") {
                    console.log("You chose to DIG.");
                    dig(clickedX, clickedY);
                    players[0].actionsLeft--;
                    playerData();

                    if (players[0].bottlesOfWater === 0) {
                        console.log("Game Over! You ran out of water bottles.");
                    }
                }
            } else {
                console.log(
                    "You have no more actions left or no action selected."
                );
            }
        }
    });

    const digButton = document.querySelector(".dig");
    digButton.addEventListener("click", function () {
        selectedAction = "dig";

        if (players[0].actionsLeft > 0) {

            dig(playerPosition.x, playerPosition.y);

            // players[0].actionsLeft--;
            playerData();

            if (players[0].bottlesOfWater === 0) {
                console.log("Game Over! You ran out of water bottles.");
                return;
            }

            if (players[0].actionsLeft === 0) {
                players[0].bottlesOfWater--;
                playerData();
                players[0].actionsLeft = 3;
            }
        } else {
            console.log("You have no more actions left.");
        }
    });
});
