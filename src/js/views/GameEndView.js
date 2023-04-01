import { createElement } from "../utils";
import GameActions from "./components/GameActions";

const gameEndContainer = document.querySelector(".game-end-container");

function GameEndView() {
  const { node: actions, ...actionProps } =
    GameActions().buildAction("New Game");

  const render = (result) => {
    const resultNode = createElement(`<p class="game-result">${result}</p>`);
    gameEndContainer.append(resultNode, actions);
  };

  const clear = () => gameEndContainer.replaceChildren();

  return {
    render,
    clear,
    ...actionProps,
  };
}

export default GameEndView;
