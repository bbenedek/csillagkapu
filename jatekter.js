document.addEventListener("DOMContentLoaded", function () {
    const grid = document.querySelector(".grid");
    const width = 5;
    let squares = [];
    let dugTiles = [];
    let playerPosition = { x: 2, y: 2 };

    let planePartsData = {
        planePart1: {
            position: null,
            rowClueX: null,
            rowClueY: null,
            columnClueX: null,
            columnClueY: null,
            imgSrc: "./Assets/Item1.png",
            rowClueSrc: "./Assets/cluecol1.png",
            columnClueSrc: "./Assets/cluerow1.png",
        },
        planePart2: {
            position: null,
            rowClueX: null,
            rowClueY: null,
            columnClueX: null,
            columnClueY: null,
            imgSrc: "./Assets/Item2.png",
            rowClueSrc: "./Assets/cluecol2.png",
            columnClueSrc: "./Assets/cluerow2.png",
        },
        planePart3: {
            position: null,
            rowClueX: null,
            rowClueY: null,
            columnClueX: null,
            columnClueY: null,
            imgSrc: "./Assets/Item3.png",
            rowClueSrc: "./Assets/cluecol3.png",
            columnClueSrc: "./Assets/cluerow3.png",
        },
    };
    const planePartsArray = ["planePart1", "planePart2", "planePart3"];

    const oasisArray = ["oasis", "oasis", "oasis", "mirage"];

    const emptyArray = Array(
        width * width - oasisArray.length - planePartsArray.length - 1
    ).fill("empty");

    const gameArray = oasisArray.concat(planePartsArray, emptyArray);

    let shuffledArray = gameArray.sort(() => Math.random() - 0.5);
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
                    const partNumber = parseInt(
                        squares[i][j].replace("planePart", "")
                    );

                    planePartsData[`planePart${partNumber}`].position = {
                        x: j,
                        y: i,
                    };

                    let emptyRow = findEmptyInRow(squares, i);
                    let emptyColumn = findEmptyInColumn(squares, j);

                    if (emptyRow !== -1) {
                        squares[i][emptyRow] = "rowClue" + partNumber;
                    }

                    if (emptyColumn !== -1) {
                        squares[emptyColumn][j] = "columnClue" + partNumber;
                    }
                }
            }
        }

        for (let i = 0; i < width; i++) {
            for (let j = 0; j < width; j++) {
                if (squares[i][j].startsWith("rowClue")) {
                    const partNumber = squares[i][j].slice(-1);
                    planePartsData[`planePart${partNumber}`].rowClueX = i;
                    planePartsData[`planePart${partNumber}`].rowClueY = j;
                }
            }
        }

        for (let i = 0; i < width; i++) {
            for (let j = 0; j < width; j++) {
                if (squares[i][j].startsWith("columnClue")) {
                    const partNumber = squares[i][j].slice(-1);
                    planePartsData[`planePart${partNumber}`].columnClueX = i;
                    planePartsData[`planePart${partNumber}`].columnClueY = j;
                }
            }
        }
    }

    function everyThingsInPlace(squares) {
        let empty = 0;
        let oasis = 0;
        let mirage = 0;
        let columnClues = 0;
        let rowClues = 0;
        let planeParts = 0;
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < width; j++) {
                if (squares[i][j] === "empty") {
                    empty++;
                } else if (squares[i][j] === "oasis") {
                    oasis++;
                } else if (squares[i][j] === "mirage") {
                    mirage++;
                } else if (squares[i][j].startsWith("columnClue")) {
                    columnClues++;
                } else if (squares[i][j].startsWith("rowClue")) {
                    rowClues++;
                } else if (squares[i][j].startsWith("planePart")) {
                    planeParts++;
                }
            }
        }
        // console.log(empty, oasis, mirage, columnClues, rowClues, planeParts);
        console.log(
            empty === 11 &&
                oasis === 3 &&
                mirage === 1 &&
                columnClues === 3 &&
                rowClues === 3 &&
                planeParts === 3
        );

        return (
            empty === 11 &&
            oasis === 3 &&
            mirage === 1 &&
            columnClues === 3 &&
            rowClues === 3 &&
            planeParts === 3
        );
    }

    function findEmptyInRow(squares, row) {
        for (let i = 0; i < width; i++) {
            if (squares[row][i] === "empty") {
                return i;
            }
        }
        return -1;
    }

    function findEmptyInColumn(squares, column) {
        for (let i = 0; i < width; i++) {
            if (squares[i][column] === "empty") {
                return i;
            }
        }
        return -1;
    }

    let players = [];

    function addPlayer() {
        const playerName = prompt("Enter player name:");
        // const playerName = "Ferenc";
        if (playerName) {
            const newPlayer = {
                name: playerName,
                actionsLeft: 3,
                bottlesOfWater: 6,
            };
            players.push(newPlayer);
        } else {
            console.log("Must enter a name");
        }
    }

    function playerData() {
        const playerInfoContainer = document.getElementById(
            "playerInfoContainer"
        );

        playerInfoContainer.innerHTML = "";

        for (let i = 0; i < players.length; i++) {
            const playerDiv = document.createElement("div");
            playerDiv.classList.add("player-info");

            const playerName = document.createElement("h2");
            playerName.innerHTML = `${players[i].name}`;

            const actionsLeft = document.createElement("div");
            actionsLeft.innerHTML = `<img src="./Assets/actions.png" class="small-icon"></img>Actions left: ${players[i].actionsLeft}`;

            const waterBottles = document.createElement("p");
            waterBottles.innerHTML = `<img src="./Assets/Water.png" class="small-icon"></img>Water bottles left: ${players[i].bottlesOfWater}`;

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
                    img.setAttribute("src", "./Assets/Oasis_marker.png");
                    img.setAttribute("class", "oasis-marker");
                    square.appendChild(img);
                } else if (i * width + j === middleIndex) {
                    img.setAttribute("src", "./Assets/Stargate.png");
                    square.appendChild(img);
                } else {
                    img.setAttribute("src", "./Assets/background.png");
                    img.setAttribute("class", "background");
                    square.appendChild(img);
                }
                if (playerPosition.x === j && playerPosition.y === i) {
                    square.setAttribute(
                        "id",
                        "sq" + (i * width + j) + "-player1"
                    );
                    const playerImg = document.createElement("img");
                    playerImg.setAttribute("src", "./Assets/Player.png");
                    playerImg.setAttribute("id", "playerImg");
                    square.appendChild(playerImg);
                }

                square.classList.add(squares[i][j]);

                row.appendChild(square);
            }
        }
    }

    createSquaresMatrix(shuffledArray);
    // everyThingsInPlace(squares);
    if (everyThingsInPlace(squares)) {
        addPlayer();
        createBoard();
        playerData();
    }
    else {
        alert("The board did not generate properly. Please refresh the page.");
        squares = [];
    }

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
        newPlayerImg.setAttribute("src", "./Assets/Player.png");
        newPlayerImg.setAttribute("id", "playerImg");

        newPlayerSquare.appendChild(newPlayerImg);

        newPlayerSquare.classList.add("player-moving");

        setTimeout(() => {
            newPlayerSquare.classList.remove("player-moving");
        }, 500);
    }

    function isPlanePartCluesFound(planePartNumber) {
        let rowX = planePartsData[`planePart${planePartNumber}`].rowClueX;
        let rowY = planePartsData[`planePart${planePartNumber}`].rowClueY;
        let colX = planePartsData[`planePart${planePartNumber}`].columnClueX;
        let colY = planePartsData[`planePart${planePartNumber}`].columnClueY;
        const rowClue = `${rowY},${rowX}`;
        const columnClue = `${colY},${colX}`;
        console.log(rowClue, columnClue);
        return dugTiles.includes(rowClue) && dugTiles.includes(columnClue);
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
                markerImg.src = "./Assets/Oasis.png";
                players[0].bottlesOfWater = 6;
            } else if (
                currentPlayerTile === "mirage" &&
                !dugTiles.includes(`${clickedX},${clickedY}`)
            ) {
                players[0].actionsLeft--;
                markerImg.src = "./Assets/Drought.png";
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
                if (isPlanePartCluesFound(planePartNumber)) {
                    tileImg.src =
                        planePartsData[`planePart${planePartNumber}`].imgSrc;
                    tileImg.style.opacity = 1;
                    dugTiles.push(`${clickedX},${clickedY}`);
                } else {
                    tileImg.src =
                        planePartsData[`planePart${planePartNumber}`].imgSrc;
                    tileImg.style.opacity = 0.5;
                }
            } else if (currentPlayerTile.startsWith("rowClue")) {
                const clueNumber = currentPlayerTile.slice(-1);
                tileImg.src =
                    planePartsData[`planePart${clueNumber}`].rowClueSrc;
                tileImg.style.opacity = 1;
                dugTiles.push(`${clickedX},${clickedY}`);
            } else if (currentPlayerTile.startsWith("columnClue")) {
                const clueNumber = currentPlayerTile.slice(-1);
                tileImg.src =
                    planePartsData[`planePart${clueNumber}`].columnClueSrc;
                tileImg.style.opacity = 1;
                dugTiles.push(`${clickedX},${clickedY}`);
            } else if (currentPlayerTile === "empty") {
                tileImg.src = "./Assets/Hole.png";
                tileImg.style.opacity = 1;
                tileImg.setAttribute("class", "hole");
                dugTiles.push(`${clickedX},${clickedY}`);
            }
            console.log(dugTiles);
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
        if (players[0].bottlesOfWater === 1 && players[0].actionsLeft === 0) {
            alert("Game Over! You ran out of water bottles.");
            return;
        }

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
                        if (
                            players[0].actionsLeft === 0 &&
                            players[0].bottlesOfWater > 0
                        ) {
                            players[0].bottlesOfWater--;
                            players[0].actionsLeft = 3;
                            playerData();
                            if (players[0].bottlesOfWater < 1) {
                                console.log("Game over");
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
            if (players[0].actionsLeft > 0) {
                playerData();

                if (
                    players[0].bottlesOfWater === 0 &&
                    players[0].actionsLeft === 0
                ) {
                    console.log("Game Over! You ran out of water bottles.");
                    return;
                }
            } else {
                console.log("You have no more actions left.");
            }
        }
    });

    const digButton = document.querySelector(".dig");
    digButton.addEventListener("click", function () {
        const planePartsFound = planePartsArray.every(part => {
            const partPosition = planePartsData[part].position;
            return dugTiles.includes(`${partPosition.x},${partPosition.y}`);
        });
        console.log(planePartsFound);
    
        if (planePartsFound) {
            alert("Congratulations! You have found all the plane parts. You win!");
            return;
        }
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
                players[0].actionsLeft = 3;
                playerData();
            }
        } else {
            console.log("You have no more actions left.");
        }
    });
});
