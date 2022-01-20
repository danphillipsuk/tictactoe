// create player factory function
const playerCreate = (name, marker) => {
    return {name, marker};
}

// Object to contain all code relating ot physical board
const gameBoard = (() => { 

    //create an empty array for a new game
    let board = [];
    for (let i = 0; i < 9; i++) {
        board.push('');
    }

    // create and display squares for each array index
    let squares = document.querySelector("#gameBoard");
    board.forEach(() => {
        const square = document.createElement("div");
        square.className = "square";
        squares.appendChild(square);
    })

    // eventListeners for each square
    Array.from(squares.children).forEach((square, index) => {
        square.addEventListener("click", () => {

            square.classList.add(gameMechanics.activePlayer.marker);
            square.setAttribute('data', gameMechanics.activePlayer.marker);

            // update board array
            board[index] = gameMechanics.activePlayer.marker;

            // remove event listener from completed square
            square.style.pointerEvents = "none";

            // update the number of squares left available
            gameMechanics.remainingSquares -= 1;

            gameMechanics.winnerCheck();

            if (gameMechanics.announceWinner == false) {
                if (gameMechanics.remainingSquares > 0) {
                    gameMechanics.alertNextPlayer();
                    gameMechanics.nextPlayer();
                } else if (gameMechanics.remainingSquares < 1) {
                    gameMechanics.tieGame();
                }
            }
        })
    })

    return {
        board
    };

})();

// game mechanics object 
const gameMechanics = (() => {

    // create players
    const rick = playerCreate("Rick", "O");
    const morty = playerCreate("Morty", "X");

    // create game opening
    let activePlayer = rick;
    let announceWinner = false;
    let remainingSquares = 9;

    // selectors
    let subtext = document.querySelector('.subtext'); // display winner/tie
    let playerName = document.querySelector('.player-name'); // purpose: alert player turn
    let squares = document.querySelector("#gameBoard"); // reason: to disable eventListener once winner established
    
    // winning conditions
    const winningCombinations = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];

    // check for winner
    function winnerCheck() {
        console.log("winnerCheck")
        winningCombinations.forEach((item, index) => {
            if(gameBoard.board[item[0]] === this.activePlayer.marker && gameBoard.board[item[1]] === this.activePlayer.marker && gameBoard.board[item[2]] === this.activePlayer.marker) {
                console.log("Winner!");
                subtext.innerHTML = `${this.activePlayer.name} wins!`;
                this.announceWinner = true;
                
                // Turn off eventListener once winner is established
                Array.from(squares.children).forEach((square) => {
                  square.style.pointerEvents = "none";
                })
                
                // create reset button
                reset();

            }
        })
    }

    // annouce next player turn
    function alertNextPlayer() {
        this.activePlayer === rick ? playerName.textContent = "Morty" : playerName.textContent = "Rick";
    }

    // next player
    function nextPlayer() {
        this.activePlayer === rick ? this.activePlayer = morty : this.activePlayer = rick;
        console.log(`nextPlayer() function ran`);
        console.log('active player: ' + activePlayer.name);
    }

    // announce tie game
    function tieGame() {
        subtext.innerHTML = "Tie game!";
        reset();
    }

    // create game reset button on win
    function reset() {
        const resetButton = document.createElement("button");
        resetButton.textContent = "Play Again?";
        document.querySelector(".intro").appendChild(resetButton);
        resetButton.addEventListener("click", () => {
            window.location.reload(false);
        })
    }

    return {
        activePlayer,
        remainingSquares,
        winnerCheck,
        alertNextPlayer,
        nextPlayer,
        tieGame,
        announceWinner,
        reset
    }

})();