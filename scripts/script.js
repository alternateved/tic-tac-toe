"use strict";

const playerFactory = (name, mark) => {
  return { name, mark };
};

const gameBoard = (() => {
  const container = document.querySelector(".game-container");
  const board = Array.from(document.querySelectorAll(".game-container > div"));
  const array = ["", "", "", "", "", "", "", "", ""];
  const clear = () => {
    if (container.classList.contains("hidden")) {
      container.classList.remove("hidden");
    }
    for (let i = 0; i < board.length; i++) {
      board[i].className = "";
      board[i].textContent = "";
      array[i] = "";
    }
    gameController.resetTurn();
    displayController.commentary.textContent = ``;
  };

  return {
    container,
    board,
    array,
    clear,
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
  const modal = document.querySelector(".modal");
  const toggleModal = () => {
    modal.classList.toggle("hidden");
  };
  const writeToModal = (string) => {
    modal.querySelector("span").textContent = string;
  };
  const modalNewRoundButton = document.querySelector("#new-round");
  modalNewRoundButton.addEventListener("click", () => {
    gameBoard.clear();
    toggleModal();
  });
  const modalNewGameButton = document.querySelector("#new-game");
  const changeOpponentButton = document.querySelector("#change-opponent");
  const restartButton = document.querySelector("#restart");
  restartButton.addEventListener("click", gameBoard.clear);

  const commentary = document.querySelector("#explainer");

  return {
    render,
    toggleModal,
    writeToModal,
    commentary,
  };
})();

const gameController = (() => {
  let turn = 0;

  const playWithHuman = (array, board, moves) => {
    const playerOne = playerFactory("Person One", "X");
    const playerTwo = playerFactory("Person Two", "O");
    let result = "";

    board.forEach((spot) =>
      spot.addEventListener("click", () => {
        // check if spot is already taken
        if (spot.textContent) {
          return;
          // if not taken then take it!
        } else {
          // playerOne's turn
          if (turn % 2 == 0) {
            displayController.commentary.textContent = `Now, it is ${playerOne.name}'s turn`;
            array[board.indexOf(spot)] = playerOne.mark;
            result = checkForWinner(array, playerOne);
            console.log(turn);
            // playerTwo's turn
          } else {
            displayController.commentary.textContent = `Now, it is ${playerTwo.name}'s turn`;
            array[board.indexOf(spot)] = playerTwo.mark;
            result = checkForWinner(array, playerTwo);
            console.log(turn);
          }
          displayController.render(array, board);

          if (result) {
            resetTurn();
            displayController.writeToModal(`Winner is ${result}`);
            displayController.toggleModal();
          } else if (!array.some((spot) => spot === "")) {
            console.log("It's a tie!");
            resetTurn();
            displayController.writeToModal(`It's a tie!`);
            displayController.toggleModal();
          }
          turn++;
        }
      })
    );
  };
  const checkForWinner = (array, player) => {
    //check rows
    for (let i = 0; i < 9; i = i + 3) {
      if (array[i] === player.mark) {
        if (array[i] === array[i + 1] && array[i + 1] === array[i + 2]) {
          return player.name;
        }
      }
    }
    // check columns
    for (let i = 0; i < 3; i++) {
      if (array[i] === player.mark) {
        if (array[i] === array[i + 3] && array[i + 3] === array[i + 6]) {
          return player.name;
        }
      }
    }
    // check diagonal
    if (array[0] === player.mark) {
      if (array[0] === array[4] && array[4] === array[8]) {
        return player.name;
      }
    }
    // check anti-diagonal
    if (array[2] === player.mark) {
      if (array[2] === array[4] && array[4] === array[6]) {
        return player.name;
      }
    }
  };
  const resetTurn = () => {
    turn = 0;
  };

  return {
    playWithHuman,
    resetTurn,
  };
})();

gameController.playWithHuman(gameBoard.array, gameBoard.board);

/* TO-DO-LIST
  X Move turn variable to gameController logic
  - Create a modal popup announcing the winner of the game
  - Hide gameboard and ask players for their names, then start the gam
  - Create and option in the beginning to choose opponent (human or AI)
  - Create an AI
*/
