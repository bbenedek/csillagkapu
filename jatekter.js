document.addEventListener("DOMContentLoaded", function () {
    const grid = document.querySelector(".grid");
    const width = 5;
    const numberOfPlaneParts = 3;
    const numberOfClues = numberOfPlaneParts * 2;
    let numberOfActionsLeft = 3;
    let players = ["player1"];
    let squares = [];
    let playerPosition = { x: 2, y: 2 };
    let currentPlayerPosition;

    const oasisArray = ["oasis", "oasis", "oasis", "mirage"];
    const planePartsArray = ["planePart1", "planePart2", "planePart3"];
    const cluesArray = ["rowClue", "columnClue"];
    const emptyArray = Array(width * width - oasisArray.length - planePartsArray.length - cluesArray.length - 1).fill("empty");
    const gameArray = oasisArray.concat(planePartsArray, cluesArray, emptyArray);
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);
    const middleIndex = Math.floor(width * width / 2);
    shuffledArray.splice(middleIndex, 0, "player1");

    function createBoard() {
        for (let i = 0; i < width; i++) {
            const row = document.createElement("div");
            row.classList.add("row");
            grid.appendChild(row);
            squares.push([]);

            for (let j = 0; j < width; j++) {
                const square = document.createElement("div");
                const index = i * width + j;
                square.setAttribute("id", "sq" + index);
                square.innerHTML = shuffledArray[index];
                square.classList.add(shuffledArray[index]);

                if (index === middleIndex) {
                    square.innerHTML = "startPosition";
                }

                row.appendChild(square);
                squares[i].push(square);
            }
        }
    }
    createBoard();

    function isAdjacent(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2) === 1;
    }

    function movePlayer(newX, newY) {
        squares[playerPosition.y][playerPosition.x].classList.remove("player1");
        playerPosition.x = newX;
        playerPosition.y = newY;
        squares[newY][newX].classList.add("player1");
        console.log("Player moved to:", newX, newY);
    }

    function dig() {
        const currentPlayerTile = squares[playerPosition.y][playerPosition.x];
        const className = currentPlayerTile.classList[0];
        console.log("Class under the player's tile:", className);
    }

    // Event listener for the DIG button
    const digButton = document.querySelector(".dig");
    digButton.addEventListener("click", function () {
        console.log("You chose to DIG.");
        dig();
        grid.addEventListener("click", function (event) {
            const clickedSquare = event.target;
            const clickedIndex = squares.flat().indexOf(clickedSquare);
            const clickedX = clickedIndex % width;
            const clickedY = Math.floor(clickedIndex / width);
            //grid.removeEventListener("click", handleGridClick);
            numberOfActionsLeft--;
            console.log("Actions left:", numberOfActionsLeft);
            enableActionSelection();
        });
        disableActionSelection();
    });

    // Event listener for the MOVE button
    const moveButton = document.querySelector(".move");
    moveButton.addEventListener("click", function () {
        console.log("You chose to MOVE.");
        grid.addEventListener("click", function (event) {
            const clickedSquare = event.target;
            const clickedIndex = squares.flat().indexOf(clickedSquare);
            const clickedX = clickedIndex % width;
            const clickedY = Math.floor(clickedIndex / width);
            if (numberOfActionsLeft > 0) {
                if (isAdjacent(playerPosition.x, playerPosition.y, clickedX, clickedY)) {
                    movePlayer(clickedX, clickedY);
                    numberOfActionsLeft--;
                    console.log("Actions left:", numberOfActionsLeft);
                    enableActionSelection();
                } else {
                    console.log("You can only move to adjacent tiles.");
                }
                currentPlayerPosition = squares[clickedY][clickedX];
            }
            else {
                console.log("You have no more actions left.");
            }
            //enableActionSelection();
        });
        disableActionSelection();
    });

    function enableActionSelection() {
        digButton.disabled = false;
        moveButton.disabled = false;
    }

    function disableActionSelection() {
        digButton.disabled = true;
        moveButton.disabled = true;
    }
});