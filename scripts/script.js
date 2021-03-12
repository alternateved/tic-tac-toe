const playerFactory = (name, marker) => {
  return {name, marker};
};
const gameBoard = (() => {
  const board = Array.from(document.querySelectorAll(".game-container > div"));
  const array = [
    [],[],[],
    [],[],[],
    [],[],[]
  ];
  const clear = () => board.forEach(square => square.textContent = "");
  const render = () => {
    board.forEach((node) =>
      node.addEventListener("click", (event) => {
        if (event.target.textContent) {
        } else {
          event.target.classList.add("x");
          event.target.textContent = "X";
        }
      })
    );
  };
  return { clear, render };
})();

const displayController = (() => {})();

gameBoard.render();
