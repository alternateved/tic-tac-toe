const playerFactory = (name, marker) => {
  return {name, marker};
};

const gameBoard = (() => {
  const board = Array.from(document.querySelectorAll(".game-container > div"));
  const array = [
    ["X"],[],[],
    [],["O"],[],
    ["O"],[],["X"]
  ];
  const clear = () => board.forEach(square => {
    square.className = "";
    square.textContent = "";
  });
  
  const clearButton = document.querySelector(".commentary > button");
  clearButton.addEventListener("click", clear);
  
  return { board, array, clear };
})();

const displayController = (() => {
  const render = (array, board) => {
    for(let i = 0; i < array.length; i++) {
      if(array[i] == "X") {
        board[i].classList.add("x");
      } else {
        board[i].classList.add("o");
      }
      board[i].textContent = array[i];
    }
  };
  return {
    render
  };
})();


displayController.render(gameBoard.array, gameBoard.board);
