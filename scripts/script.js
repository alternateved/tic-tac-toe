"use strict";

// produce player object
const playerFactory = (name, mark) => {
  return { name, mark };
};

const gameBoard = (() => {

  // create array from DOM nodelist and simple array for storing results
  const board = Array.from(document.querySelectorAll(".game-container > div"));
  const array = ["", "", "", "", "", "", "", "", ""];

  // clear commentary, all marks from board, empty array and reset turn
  const clear = () => {
    for (let i = 0; i < board.length; i++) {
      board[i].className = "";
      board[i].textContent = "";
      array[i] = "";
    }
    gameController.resetTurn();
    displayController.commentary.textContent = ``;
  };

  return {
    board,
    array,
    clear,
  };
})();

const displayController = (() => {

  // render array to board
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

  // all necessary DOM elements
  const header = document.querySelector("header");
  const commentary = document.querySelector("#explainer");
  const container = document.querySelector(".game-container");
  const playHumanButton = document.querySelector("#human");
  const playAIButton = document.querySelector("#AI");
  const modalNewRoundButton = document.querySelector("#new-round");
  const modalNewGameButton = document.querySelector("#new-game");
  const changeOpponentButton = document.querySelector("#change-opponent");
  const restartButton = document.querySelector("#restart");
  const modal = document.querySelector(".modal");
  const beginningModal = document.querySelector(".beginning-modal");
  const form = document.querySelector("#player-names");
  const playerTwoLabel = document.querySelector("#player-two-label");
  const playerTwoInput = document.querySelector("#player-two-input");

  // toggle modal with player's name input
  const toggleBeginningModal = () => {
    beginningModal.classList.toggle("hidden");
  };

  // toggle header animation
  const toggleBeginning = () => {
    header.classList.toggle("beginning");
  };

  // toggle all buttons and gameboard
  const toggleInterface = () => {
    container.classList.toggle("hidden");
    restartButton.classList.toggle("hidden");
    changeOpponentButton.classList.toggle("hidden");
    playHumanButton.classList.toggle("hidden");
    playAIButton.classList.toggle("hidden");
  };

  // toggle modal after finishing game
  const toggleModal = () => {
    modal.classList.toggle("hidden");
  };

  // write comment after finished game
  const writeToModal = (string) => {
    modal.querySelector("span").textContent = string;
  };

  // toggle custom modal for 2-players game
  playHumanButton.addEventListener("click", () => {
    if (playerTwoLabel.classList.contains("hidden")) {
      playerTwoLabel.classList.toggle("hidden");
    }
    if (playerTwoInput.classList.contains("hidden")) {
      playerTwoInput.classList.toggle("hidden");
    }
    toggleBeginning();
    toggleBeginningModal();
  });

  // toggle custom modal for game with AI
  playAIButton.addEventListener("click", () => {
    if (!playerTwoLabel.classList.contains("hidden")) {
      playerTwoLabel.classList.toggle("hidden");
    }
    if (!playerTwoInput.classList.contains("hidden")) {
      playerTwoInput.classList.toggle("hidden");
    }
    toggleBeginning();
    toggleBeginningModal();
  });

  // start anew
  restartButton.addEventListener("click", gameBoard.clear);

  // go back to main screen and start anew
  changeOpponentButton.addEventListener("click", () => {
    gameBoard.clear();
    toggleBeginning();
    toggleInterface();
  });

  // go back to main screen and start anew from modal
  modalNewGameButton.addEventListener("click", () => {
    gameBoard.clear();
    toggleModal();
    toggleBeginning();
    toggleInterface();
  });

  // start anew from modal
  modalNewRoundButton.addEventListener("click", () => {
    gameBoard.clear();
    toggleModal();
  });

  // create new game for provided players (or player if game with AI)
  form.addEventListener("submit", (event) => {
    // check if user submitted from Human Play or AI Play
    if (event.target[1].classList.contains("hidden")) {
      gameController.setPlayerName(form);
      toggleBeginningModal();
      toggleInterface();
      gameController.playWithAI(gameBoard.array, gameBoard.board);
      form.reset();
      event.preventDefault();
    } else {
      gameController.setPlayerNames(form);
      toggleBeginningModal();
      toggleInterface();
      gameController.playWithHuman(gameBoard.array, gameBoard.board);
      form.reset();
      event.preventDefault();
    }
  });

  return {
    render,
    toggleBeginning,
    toggleModal,
    writeToModal,
    commentary,
  };
})();

const gameController = (() => {
  
  let turn = 0;
  let playerOne = "";
  let playerTwo = "";

  // set player names if game for two players
  const setPlayerNames = (form) => {
    playerOne = playerFactory(form.elements["player-one"].value, "X");
    playerTwo = playerFactory(form.elements["player-two"].value, "O");
  };

  // set player name if game with AI
  const setPlayerName = (form) => {
    playerOne = playerFactory(form.elements["player-one"].value, "X");
    playerTwo = playerFactory("AI", "O");
  };

  // main logic of game round with human
  const playWithHuman = (array, board) => {
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
            displayController.writeToModal(`${result} is the winner!`);
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

  // main logic of game round with AI
  const playWithAI = (array, board) => {
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

  // check all possibilities if last player's move was a winning one
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
    setPlayerNames,
    setPlayerName,
    playWithHuman,
    playWithAI,
    resetTurn,
  };
})();

/* TO-DO-LIST
  X Move turn variable to gameController logic
  X Create a modal popup announcing the winner of the game
  X Hide gameboard and ask players for their names, then start the game
  X Create and option in the beginning to choose opponent (human or AI)
  - Create an AI
*/
