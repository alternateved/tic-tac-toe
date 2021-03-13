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
  };

  const clearButton = document.querySelector(".commentary > button");
  clearButton.addEventListener("click", clear);

  return {
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

  return {
    render,
  };
})();

const gameController = (() => {
  const playWithHuman = (array, board) => {
    const playerOne = playerFactory("Person One", "X");
    const playerTwo = playerFactory("Person Two", "O");
    let turn = 0;

    board.forEach((spot) =>
      spot.addEventListener("click", () => {
        if (spot.textContent) {
          // check if spot is already taken
          return;
        } else {
          // if not then take it!
          if (turn % 2 == 0) {
            // playerOne's turn
            array[board.indexOf(spot)] = playerOne.mark;
            if (checkForWinner(array, playerOne.mark)) {
              console.log("Winner is X");
            }
            console.log(turn);
          } else {
            // playerTwo's turn
            array[board.indexOf(spot)] = playerTwo.mark;
            if (checkForWinner(array, playerTwo.mark)) {
              console.log("Winner is O");
            }

            console.log(turn);
          }
          displayController.render(array, board);

          if (turn == 8) {
            // check if tie

            turn = 0;
            console.log("It's a tie!");
          }
          turn++;
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

gameController.playWithHuman(gameBoard.array, gameBoard.board);
