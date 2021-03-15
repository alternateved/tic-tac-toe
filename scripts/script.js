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
  let result = "";
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

  // helper function for random number generation in range 0 to 8
  const generateRandomNumber = () => {
    return Math.floor(Math.random() * 9);
  };

  // generate random number and check if array is empty for that index
  const generateRandomMove = (array) => {
    let choice = generateRandomNumber();
    while (array[choice] !== "") {
      choice = generateRandomNumber();
    }
    return choice;
  };

  const getCurrentArrayState = (array) => {
    return array.map((element, index) => (element ? element : index));
  };
  // return filtered array with number of array's indexes that are not taken
  const getEmptyArrayIndexes = (array) => {
    return array.filter((element) => element !== "X" && element !== "O");
  };

  // return best move available with help of minimax algorithm
  const minimax = (array, passedMark) => {
    const humanMark = "X";
    const aiMark = "O";
    // store current array state with empty places switched to indexes of that places
    const currentArrayState = getCurrentArrayState(array);
    
    // create an array of available moves
    const availableMoves = getEmptyArrayIndexes(currentArrayState);
    // keep log of each trial run
    const trialRunLogs = [];

    // console.log(availableMoves.length);

    // check for terminal state - if any player won or if it is a tie
    if (checkForWinningCombination(currentArrayState, humanMark)) {
      return { score: -1 };
    } else if (checkForWinningCombination(currentArrayState, aiMark)) {
      return { score: 1 };
    } else if (availableMoves.length === 0) {
      return { score: 0 };
    }

    // loop through each available move and test outcome of that move
    for (let i = 0; i < availableMoves.length; i++) {
      // store log of this trial run
      const trialRun = {};
      // store current index
      trialRun.index = currentArrayState[availableMoves[i]];
      currentArrayState[availableMoves[i]] = passedMark;

      // check what has changes since move was taken and run function recursively
      if (passedMark === aiMark) {
        const result = minimax(currentArrayState, humanMark);
        trialRun.score = result.score;
      } else {
        const result = minimax(currentArrayState, aiMark);
        trialRun.score = result.score;
      }
      // revert changes
      currentArrayState[availableMoves[i]] = trialRun.index;
      // append the result of the trial run to the trialRunLogs
      trialRunLogs.push(trialRun);
    }

    // create a store most succesfull trial run reference
    let bestTrialRun = null;

    // get the reference to the best trial run
    if (passedMark === aiMark) {
      let bestScore = -Infinity;
      for (let i = 0; i < trialRunLogs.length; i++) {
        if (trialRunLogs[i].score > bestScore) {
          bestScore = trialRunLogs[i].score;
          bestTrialRun = i;
        }
      }
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < trialRunLogs.length; i++) {
        if (trialRunLogs[i].score < bestScore) {
          bestScore = trialRunLogs[i].score;
          bestTrialRun = i;
        }
      }
    }

    // return index of best trial run for the current player - maximize for AI, minimize for human
    return trialRunLogs[bestTrialRun];
  };

  // main logic of game round with human
  const playWithHuman = (array, board) => {
    displayController.commentary.textContent = `Choose wisely your move`;

    board.forEach((spot) =>
      spot.addEventListener("click", () => {
        // check if spot is already taken
        if (spot.textContent) {
          return;
          // if not taken then take it!
        } else {
          // playerOne's turn
          if (turn % 2 == 0) {
      
            array[board.indexOf(spot)] = playerOne.mark;
            if (checkForWinningCombination(array, playerOne.mark)) {
              result = playerOne.name;
            }
            displayController.commentary.textContent = `Now, it is ${playerTwo.name}'s turn`;
            console.log(turn);
            // playerTwo's turn
          } else {
            array[board.indexOf(spot)] = playerTwo.mark;
            if (checkForWinningCombination(array, playerTwo.mark)) {
              result = playerTwo.name;
            }
            displayController.commentary.textContent = `Now, it is ${playerOne.name}'s turn`;
            console.log(turn);
          }
          displayController.render(array, board);

          // check if there is a winner of if it is a tie
          evaluateResult(result, array)

          turn++;
        }
      })
    );
  };

  // main logic of game round with AI
  const playWithAI = (array, board) => {
    board.forEach((spot) =>
      spot.addEventListener("click", () => {
        // check if spot is already taken
        if (spot.textContent) {
          return;
          // if not taken then take it!
        } else {
          // playerOne's turn
          displayController.commentary.textContent = `Now, it is ${playerOne.name}'s turn`;
          array[board.indexOf(spot)] = playerOne.mark;
          if (checkForWinningCombination(array, playerOne.mark)) {
            result = playerOne.name;
          }
          turn++;
          displayController.render(array, board);

          if (evaluateResult(result, array)) {
            return;
          } else {
            // AI's turn
            displayController.commentary.textContent = `Now, it is ${playerTwo.name}'s turn`;
            setTimeout( () =>{
              array[minimax(array, playerTwo.mark).index] = playerTwo.mark;
              // array[generateRandomMove(array)] = playerTwo.mark;

              if (checkForWinningCombination(array, playerTwo.mark)) {
                result = playerTwo.name;
              }
              displayController.render(array, board);
              turn++;
              evaluateResult(result, array);
            }, 500);
          }
        }
      })
    );
  };

  // check if the game has been won or tied
  const evaluateResult = (result, array) => {
    if (result) {
      resetTurn();
      displayController.writeToModal(`Winner is ${result}`);
      displayController.toggleModal();
      return true;
    } else if (!array.some((spot) => spot === "")) {
      resetTurn();
      displayController.writeToModal(`It's a tie!`);
      displayController.toggleModal();
      return true;
    }
    return false;
  };

  // check all possibilities if last player's move was a winning one
  const checkForWinningCombination = (array, mark) => {
    //check rows
    for (let i = 0; i < 9; i = i + 3) {
      if (array[i] === mark) {
        if (array[i] === array[i + 1] && array[i + 1] === array[i + 2]) {
          return true;
        }
      }
    }
    // check columns
    for (let i = 0; i < 3; i++) {
      if (array[i] === mark) {
        if (array[i] === array[i + 3] && array[i + 3] === array[i + 6]) {
          return true;
        }
      }
    }
    // check diagonal
    if (array[0] === mark) {
      if (array[0] === array[4] && array[4] === array[8]) {
        return true;
      }
    }
    // check anti-diagonal
    if (array[2] === mark) {
      if (array[2] === array[4] && array[4] === array[6]) {
        return true;
      }
    }
    return false;
  };
  const resetTurn = () => {
    turn = 0;
    result = "";
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
  X Create an AI
*/
