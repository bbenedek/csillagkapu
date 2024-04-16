document.addEventListener("DOMContentLoaded", function () {
    const grid = document.querySelector(".grid");
    const width = 5;
    let squares = [];
    let dugTiles = [];
    let playerPosition = { x: 2, y: 2 };
    let selectedAction = null;

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
            rowClueSrc: "/Assets/cluerow1.png",
            columnClueSrc: "/Assets/cluecol1.png",
        },
        planePart2: {
            rowClue: null,
            columnClue: null,
            imgSrc: "/Assets/Item2.png",
            rowClueSrc: "/Assets/cluerow2.png",
            columnClueSrc: "/Assets/cluecol2.png",
        },
        planePart3: {
            rowClue: null,
            columnClue: null,
            imgSrc: "/Assets/Item3.png",
            rowClueSrc: "/Assets/cluerow3.png",
            columnClueSrc: "/Assets/cluecol3.png",
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

        // for (let i = 0; i < width; i++) {
        //     for (let j = 0; j < width; j++) {
        //         if (squares[i][j].startsWith("planePart")) {
        //             const planePartNumber = squares[i][j].slice(-1);
        //             const rowCluePos = planePartsData[`planePart${planePartNumber}`].columnClue - 1;
        //             const colCluePos = planePartsData[`planePart${planePartNumber}`].rowClue - 1;
        //             [squares[i][j], squares[colCluePos][rowCluePos]] = [squares[colCluePos][rowCluePos], squares[i][j]];
        //         }
        //     }
        // }
    }

    let players = [];

    function addPlayer() {
        const playerName = "Bela";
        if (playerName) {
            const newPlayer = {
                name: playerName,
                actionsLeft: 3,
                bottlesOfWater: 6,
            };
            players.push(newPlayer);
            console.log(`Player ${playerName} added.`);
        } else {
            console.log("Player name cannot be empty.");
        }
    }

    addPlayer();

    function playerData() {
        const playerInfoContainer = document.getElementById(
            "playerInfoContainer"
        );

        playerInfoContainer.innerHTML = "";

        for (let i = 0; i < players.length; i++) {
            const playerDiv = document.createElement("div");
            playerDiv.classList.add("player-info");

            const playerName = document.createElement("h2");
            playerName.innerHTML = `Player ${i + 1}: ${players[i].name}`;

            const actionsLeft = document.createElement("div");
            actionsLeft.innerHTML = `<img src="/Assets/actions.png" class="small-icon"></img>Actions left: ${players[i].actionsLeft}`;

            const waterBottles = document.createElement("p");
            waterBottles.innerHTML = `<img src="/Assets/Water.png" class="small-icon"></img>Water bottles left: ${players[i].bottlesOfWater}`;

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
    updatePlanePartsData();

    function isAdjacent(x1, y1, x2, y2) {
        if (x2 === 2 && y2 === 2) {
            return false;
        }
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

        newPlayerSquare.classList.add("player-moving");

        setTimeout(() => {
            newPlayerSquare.classList.remove("player-moving");
        }, 500);
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
                players[0].actionsLeft--;
                markerImg.src = "/Assets/Oasis.png";
                players[0].bottlesOfWater = 6;
            } else if (
                currentPlayerTile === "mirage" &&
                !dugTiles.includes(`${clickedX},${clickedY}`)
            ) {
                players[0].actionsLeft--;
                markerImg.src = "/Assets/Drought.png";
                dugTiles.push(`${clickedX},${clickedY}`);
            } else {
                console.log(
                    "This tile has already been dug or is not a mirage."
                );
                return;
            }
        } else if (tileImg && !dugTiles.includes(`${clickedX},${clickedY}`)) {
            if (currentPlayerTile.startsWith("planePart")) {
                const planePartNumber = currentPlayerTile.slice(-1);
                tileImg.src =
                    planePartsData[`planePart${planePartNumber}`].imgSrc;
                tileImg.style.opacity = 1;
            } else if (currentPlayerTile.startsWith("rowClue")) {
                const clueNumber = currentPlayerTile.slice(-1);
                console.log(clueNumber);
                tileImg.src =
                    planePartsData[`planePart${clueNumber}`].rowClueSrc;
                tileImg.style.opacity = 1;
            } else if (currentPlayerTile.startsWith("columnClue")) {
                const clueNumber = currentPlayerTile.slice(-1);
                tileImg.src =
                    planePartsData[`planePart${clueNumber}`].columnClueSrc;
                tileImg.style.opacity = 1;
                
            } else if (currentPlayerTile === "empty") {
                tileImg.src = "/Assets/Hole.png";
                tileImg.style.opacity = 1;
                tileImg.setAttribute("class", "hole");
            }
            dugTiles.push(`${clickedX},${clickedY}`);
            players[0].actionsLeft--;

            if (
                players[0].bottlesOfWater === 0 &&
                players[0].actionsLeft === 0
            ) {
                console.log("Game Over! You ran out of water bottles.");
            }
        } else {
            console.log("This tile has already been dug.");
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

            if (players[0].actionsLeft > 0) {
                dig(clickedX, clickedY);
                players[0].actionsLeft--;
                playerData();

                if (
                    players[0].bottlesOfWater === 0 &&
                    players[0].actionsLeft === 0
                ) {
                    console.log("Game Over! You ran out of water bottles.");
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

        if (players[0].actionsLeft > 0 && players[0].bottlesOfWater > 0) {
            dig(playerPosition.x, playerPosition.y);
            playerData();

            if (
                players[0].bottlesOfWater === 0 &&
                players[0].actionsLeft === 0
            ) {
                console.log("Game Over! You ran out of water bottles.");
                return;
            }

            if (players[0].actionsLeft < 1) {
                console.log("ugysem tortenik semmi");
                players[0].actionsLeft = 3;
                playerData();
            }
        } else {
            console.log("You have no more actions left.");
        }
    });

    function updatePlanePartsData() {
        const container = document.getElementById("planePartsInfo");
        Object.values(planePartsData).forEach((part) => {
            const planePartDiv = document.createElement("div");
            planePartDiv.classList.add("plane-part-info");

            const image = document.createElement("img");
            image.src = part.imgSrc;
            image.classList.add("icon");
            planePartDiv.appendChild(image);

            const labelsDiv = document.createElement("div");
            labelsDiv.classList.add("plane-part-labels");

            const columnLabel = document.createElement("p");
            columnLabel.textContent = `COLUMN: ${part.columnClue}`;
            const rowLabel = document.createElement("p");
            rowLabel.textContent = `ROW: ${part.rowClue}`;

            labelsDiv.appendChild(columnLabel);
            labelsDiv.appendChild(rowLabel);

            planePartDiv.appendChild(labelsDiv);

            container.appendChild(planePartDiv);
        });
    }
});
