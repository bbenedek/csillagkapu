document.addEventListener("DOMContentLoaded", function () {
    const grid = document.querySelector(".grid");
    const width = 5;
    const numberOfPlaneParts = 3;
    const numberOfClues = numberOfPlaneParts * 2;
    let numberOfActionsLeft = 3;
    let players = ["player1"];
    let squares = [];

    const oasisArray = ["oasis", "oasis", "oasis", "mirage"];
    const planePartsArray = ["planePart1", "planePart2", "planePart3"];
    const cluesArray = ["rowClue", "columnClue"];
    const emptyArray = Array (width * width - oasisArray.length - planePartsArray.length - cluesArray.length - 1).fill("empty");
    const gameArray = oasisArray.concat(planePartsArray, cluesArray, emptyArray);
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);
    const middleIndex = Math.floor(width * width / 2);
    shuffledArray.splice(middleIndex, 0, "player1");
    console.log(shuffledArray);

    // function createBoard1() {
    //     for (let i = 0; i < width * width; i++) {
    //         const square = document.createElement("div");
    //         square.setAttribute("id", "sq" + i);
    //         square.innerHTML = shuffledArray[i];
    //         square.classList.add(shuffledArray[i]);
    //         if (i === middleIndex) {
    //             square.innerHTML = "startPosition";
    //         }       
    //         grid.appendChild(square);
    //         squares.push(square);
    //     }
    //     console.log(squares);
    // }

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
        console.log(squares);
    }
    createBoard();
});
