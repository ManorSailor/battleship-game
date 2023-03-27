import { createElement } from "../utils";
import Gameboard from "./components/Gameboard";

const boardContainer = document.querySelector(".board-container");

function GameboardView(boardModel, boardHeader) {
  const board = Gameboard(boardModel, boardHeader);

  const render = () => boardContainer.appendChild(board.node);

  const markHit = (coord) => {
    const cell = board.getCell(coord);
    const span = createElement('<span class="hit"></span>');
    cell.appendChild(span);
  };

  const markMiss = (coord) => {
    const cell = board.getCell(coord);
    const span = createElement('<span class="miss"></span>');
    cell.appendChild(span);
  };

  const bindAttackListener = (callback) => {
    board.addListener("click", (e) => {
      const coordStr = e.target.getAttribute("data-coord");
      const coord = coordStr?.split(",").map((c) => parseInt(c, 10));
      callback(coord);
    });
  };

  return {
    render,
    markHit,
    markMiss,
    bindAttackListener,
  };
}

export default GameboardView;
