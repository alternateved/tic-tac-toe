"use strict";

const playerFactory = (name, mark) => {
  return { name, mark };
};

const gameBoard = (() => {
  const board = Array.from(document.querySelectorAll(".game-container > div"));
  const array = ["", "", "", "", "", "", "", "", ""];
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
  
  const toggleBeginningModal = () => {
    beginningModal.classList.toggle("hidden");
  };

  const toggleBeginning = () => {
    playHumanButton.classList.toggle("hidden");
    playAIButton.classList.toggle("hidden");

    header.classList.toggle("beginning");
    container.classList.toggle("hidden");
    restartButton.classList.toggle("hidden");
    changeOpponentButton.classList.toggle("hidden");
  };

  const toggleModal = () => {
    modal.classList.toggle("hidden");
  };
  const writeToModal = (string) => {
    modal.querySelector("span").textContent = string;
  };
  
  restartButton.addEventListener("click", gameBoard.clear);
  playHumanButton.addEventListener("click", () => {
    if (playerTwoLabel.classList.contains("hidden")) {
      playerTwoLabel.classList.toggle("hidden");
    }
    if (playerTwoInput.classList.contains("hidden")) {
      playerTwoInput.classList.toggle("hidden");
    }
    toggleBeginningModal();
  });
  
  playAIButton.addEventListener("click", () => {
    if (!playerTwoLabel.classList.contains("hidden")) {
      playerTwoLabel.classList.toggle("hidden");
    }
    if (!playerTwoInput.classList.contains("hidden")) {
      playerTwoInput.classList.toggle("hidden");
    }
  toggleBeginningModal();
  });

  changeOpponentButton.addEventListener("click", () => {
    gameBoard.clear();
    toggleBeginning();
  });
  modalNewGameButton.addEventListener("click", () => {
    gameBoard.clear();
    toggleModal();
    toggleBeginning();
  });
  modalNewRoundButton.addEventListener("click", () => {
    gameBoard.clear();
    toggleModal();
  });

  form.addEventListener("submit", (event) => {
    // check if user submitted from Human Play or AI Play
    if (event.target[1].classList.contains("hidden")) {
      gameController.setPlayerName(form);
      toggleBeginningModal();
      toggleBeginning();
      form.reset();
      event.preventDefault();
    } else {
      gameController.setPlayerNames(form);
      toggleBeginningModal();
      toggleBeginning();
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

  const setPlayerNames = (form) => {
    playerOne = playerFactory(form.elements["player-one"].value, "X");
    playerTwo = playerFactory(form.elements["player-two"].value, "O");
  }

  const setPlayerName = (form) => {
    playerOne = playerFactory(form.elements["player-one"].value, "X");
    playerTwo = playerFactory("AI", "O");
  }

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
    setPlayerNames,
    setPlayerName,
    playWithHuman,
    resetTurn
  };
})();

gameController.playWithHuman(gameBoard.array, gameBoard.board);

/* TO-DO-LIST
  X Move turn variable to gameController logic
  X Create a modal popup announcing the winner of the game
  - Hide gameboard and ask players for their names, then start the game
  - Create and option in the beginning to choose opponent (human or AI)
  - Create an AI
*/
