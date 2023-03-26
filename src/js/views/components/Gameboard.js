import { createElement } from "../../utils";

export default function Gameboard(boardState, boardHeader) {
  // eslint-disable-next-line no-use-before-define
  const board = createBoard(boardState, boardHeader);

  const addListener = (eventType, callback) =>
    board.innerBoard.addEventListener(eventType, callback);

  const getCell = (coord) =>
    board.innerBoard.querySelector(`li[data-coord="${coord}"]`);

  return {
    getCell,
    addListener,
    node: board.outerBoard,
  };
}

const boardBody = (size, header) =>
  createElement(`
  <section class="board-wrapper">
    <h3 class="board-header">${header}</h3>
    <ul class="board" style="--grid-size: ${size};"></ul>
  </section>
`);

function createBoard(
  { size, hasShipAt = () => new Error("No method provided!") },
  boardHeader
) {
  const outerBoard = boardBody(size, boardHeader);
  const innerBoard = outerBoard.querySelector("ul.board");

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const coord = [x, y];
      const cell = createElement(`
        <li class="cell" data-coord="${coord}"></li>
      `);

      if (hasShipAt(coord)) {
        cell.classList.add("has-ship");
      }

      innerBoard.appendChild(cell);
    }
  }

  return { outerBoard, innerBoard };
}
