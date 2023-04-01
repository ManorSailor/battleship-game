import { createElement } from "../utils";
import DeploymentBoard from "./components/DeploymentBoard";
import GameActions from "./components/GameActions";

const placeShipView = document.querySelector(".placeship-view");

const boardWrapper = createElement(
  '<section class="placeship-board-view"></section>'
);

function PlacementView(boardModel, shipName) {
  const boardSection = boardWrapper.cloneNode();
  const { node: board, ...boardProps } = DeploymentBoard(boardModel, shipName);
  const { node: actions, ...actionProps } = GameActions()
    .buildAction("Autoplace")
    .buildAction("Reset Board")
    .buildAction("Start Game");

  boardSection.append(board, actions);

  const render = () => placeShipView.append(boardSection);

  const clear = () => placeShipView.replaceChildren();

  return {
    clear,
    render,
    ...boardProps,
    ...actionProps,
  };
}

export default PlacementView;
