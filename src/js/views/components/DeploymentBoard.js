import Gameboard from "./Gameboard";

function DeploymentBoard(boardModel, shipName) {
  const previewedCells = new Set();
  const board = Gameboard(boardModel, `Place your: ${shipName}`);

  const clearPreview = () => {
    previewedCells.forEach((cell) => cell.classList.remove("ship-preview"));
    previewedCells.clear();
  };

  const updatePreview = (coords) => {
    clearPreview();
    coords?.forEach((coord) => {
      const cell = board.getCell(coord);
      cell.classList.add("ship-preview");
      previewedCells.add(cell);
    });
  };

  const updateBoard = (boardState, newShipName) =>
    board.updateBoard(
      boardState,
      newShipName ? `Place your: ${newShipName}` : "Ready to Deploy"
    );

  const bindPreviewListener = (callback) => {
    board.addListener("mouseover", (e) => {
      const coordStr = e.target.dataset.coord;
      const coord = coordStr?.split(",").map((c) => parseInt(c, 10));
      callback(coord);
    });
  };

  const bindPlacementListener = (callback) => {
    board.addListener("click", (e) => {
      const coordStr = e.target.dataset.coord;
      const coord = coordStr?.split(",").map((c) => parseInt(c, 10));
      callback(coord);
    });
  };

  board.addListener("mouseout", clearPreview);

  return {
    updateBoard,
    updatePreview,
    bindPreviewListener,
    bindPlacementListener,
    node: board.node,
    resetBoard: board.resetBoard,
  };
}

export default DeploymentBoard;
