/* eslint-disable no-use-before-define */
import { createElement } from "../../utils";

export default function Gameboard(boardState, boardHeader) {
  const { outerBoard, innerBoard } = createBoard(boardState, boardHeader);

  const addListener = (eventType, callback) =>
    innerBoard.addEventListener(eventType, callback);

  const getCell = (coord) =>
    innerBoard.querySelector(`li[data-coord="${coord}"]`);

  const resetBoard = () =>
    innerBoard.replaceChildren(...generateCells(boardState));

  const updateHeader = (newBoardHeader = boardHeader) => {
    outerBoard.querySelector("h3.board-header").textContent = newBoardHeader;
  };

  const updateBoard = (newBoardState, newBoardHeader) => {
    innerBoard.replaceChildren(...generateCells(newBoardState));
    updateHeader(newBoardHeader);
  };

  return {
    getCell,
    resetBoard,
    updateBoard,
    addListener,
    updateHeader,
    node: outerBoard,
  };
}

const boardBody = (size, header) =>
  createElement(`
  <section class="board-wrapper">
    <h3 class="board-header">${header}</h3>
    <ul class="board" style="--grid-size: ${size};"></ul>
  </section>
`);

function createBoard(boardState, boardHeader) {
  const outerBoard = boardBody(boardState.size, boardHeader);
  const innerBoard = outerBoard.querySelector("ul.board");

  innerBoard.append(...generateCells(boardState));
  return { outerBoard, innerBoard };
}

function generateCells({ size, hasShipAt = () => false }) {
  const cells = [];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const coord = [x, y];
      const cell = createElement(`
        <li class="cell" data-coord="${coord}"></li>
      `);

      if (hasShipAt(coord)) {
        cell.classList.add("has-ship");
      }

      cells.push(cell);
    }
  }

  return cells;
}
