import { createElement } from "../../utils";

const actionsList = createElement('<ul class="game-actions"></ul>');

function GameActions() {
  const actionListNode = actionsList.cloneNode();
  const actionBuilder = {};

  const buildAction = (action) => {
    const actionLi = createElement(`
    <li class="">
       <button class="btn">${action}</button>
    </li>`);
    actionListNode.appendChild(actionLi);

    const bindListener = (callback) =>
      actionLi.querySelector("button").addEventListener("click", callback);

    return Object.assign(actionBuilder, {
      [`bind${action.split(" ").join("")}Listener`]: bindListener,
    });
  };

  return Object.assign(actionBuilder, { node: actionListNode, buildAction });
}

export default GameActions;
