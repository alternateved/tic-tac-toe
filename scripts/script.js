"use strict";

const playerFactory = (name, mark) => {
  return { name, mark };
};

const gameBoard = (() => {
  const container = document.querySelector(".game-container");
  const board = Array.from(document.querySelectorAll(".game-container > div"));
  const array = ["", "", "", "", "", "", "", "", ""];
  let moves = 0; // number of moves taken on the gameboard
  const clear = () => {
    if (container.classList.contains("hidden")) {
      container.classList.remove("hidden");
    }
    for (let i = 0; i < board.length; i++) {
      board[i].className = "";
      board[i].textContent = "";
      array[i] = "";
    }
    moves = 0;
    displayController.commentary.textContent = ``;
  };

  return {
    container,
    board,
    array,
    moves,
    clear
  };
})();

const displayController = (() => {
  const render = (array, board) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i] == "X") {
        board[i].classList.add("x");
      } else if (array[i] == "O") {
        board[i].classList.add("o");
      }
      board[i].textContent = array[i];
    }
  };

  const clearButton = document.querySelector(".buttons > button");
  clearButton.addEventListener("click", gameBoard.clear);
  
  const commentary = document.querySelector("#explainer");

  return {
    render,
    commentary
  };
})();

const gameController = (() => {
  const playWithHuman = (array, board, moves) => {
    const playerOne = playerFactory("Person One", "X");
    const playerTwo = playerFactory("Person Two", "O");
    let result = 0; 

    board.forEach((spot) =>
      spot.addEventListener("click", () => {

        // check if spot is already taken
        if (spot.textContent) {
          return;
        // if not taken then take it!
        } else {
          // playerOne's turn
          if (moves % 2 == 0) {
            displayController.commentary.textContent = `Now, it is ${playerOne.name}'s turn`;
            array[board.indexOf(spot)] = playerOne.mark;
            result = checkForWinner(array, playerOne.mark);
            console.log(moves);  
            // playerTwo's turn
          } else {
            displayController.commentary.textContent = `Now, it is ${playerTwo.name}'s turn`;
            array[board.indexOf(spot)] = playerTwo.mark;
            result = checkForWinner(array, playerTwo.mark);
            console.log(moves); 
          }
          displayController.render(array, board);

          if (result) {
            console.log(`Winner is ${result}`);
            moves = 0;
            // gameBoard.container.classList.add("hidden");
            // gameBoard.container.parentNode.textContent = "trolololo";
          } else if (!array.some(spot => spot === "")) {
            console.log("It's a tie!");
            moves = 0;
            // gameBoard.container.classList.add("hidden");
          }
          moves++;
        }
      })
    );
  };
  const checkForWinner = (array, mark) => {
    //check rows
    for (let i = 0; i < 9; i = i + 3) {
      if (array[i] === mark) {
        if (array[i] === array[i + 1] && array[i + 1] === array[i + 2]) {
          return mark;
        }
      }
    }
    // check columns
    for (let i = 0; i < 3; i++) {
      if (array[i] === mark) {
        if (array[i] === array[i + 3] && array[i + 3] === array[i + 6]) {
          return mark;
        }
      }
    }
    // check diagonal
    if (array[0] === mark) {
      if (array[0] === array[4] && array[4] === array[8]) {
        return mark;
      }
    }
    // check anti-diagonal
    if (array[2] === mark) {
      if (array[2] === array[4] && array[4] === array[6]) {
        return mark;
      }
    }
  };

  return {
    playWithHuman,
  };
})();

gameController.playWithHuman(gameBoard.array, gameBoard.board, gameBoard.moves);


/* TO-DO-LIST
  - Create a modal popup announcing the winner of the game
  - Hide gameboard and ask players for their names, then start the gam
  - Create and option in the beginning to choose opponent (human or AI)
  - Create an AI
*/