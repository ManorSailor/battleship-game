import Bot from "../Bot";
import Player from "../Player";
import GameboardView from "../views/GameboardView";
import PlacementView from "../views/PlacementView";

const Game = (() => {
  let human;
  let humanBoard;
  let bot;
  let botBoard;
  let placementView;

  const newGame = () => {
    bot = Bot.new();
    human = Player.new("Human");
    placementView = PlacementView(human.board, human.shipInTransit.name);

    placementView.bindPreviewListener(shipPreview);
    placementView.bindPlacementListener(placeShip);
    placementView.bindAutoplaceListener(autoplace);
    placementView.bindStartGameListener(startGame);
    // placementView.bindResetGameListener(resetGame);

    placementView.render();
  };

  const startGame = () => {
    // TODO: Check if game is ready to start
    if (!human.hasDeployedFleet()) return;
    placementView.clear();
    humanBoard = GameboardView(human.board, "Your Water");
    botBoard = GameboardView(bot.board, "Enemy Water");

    bot.autoplace();
    botBoard.bindAttackListener(gameLoop);
    humanBoard.render();
    botBoard.render();
  };

  const shipPreview = (coord) => {
    if (human.hasDeployedFleet()) return;
    const coords = human.fakePlaceShip(human.shipInTransit, coord);
    placementView.updatePreview(coords);
  };

  const placeShip = (coord) => {
    const ship = human.shipInTransit;
    const placed = human.placeShip(ship?.name, coord);

    if (placed) {
      placementView.updateBoard(human.board, human.shipInTransit?.name);
    }
  };

  const autoplace = () => {
    human.autoplace();
    placementView.updateBoard(human.board);
  };

  const gameLoop = (coord) => {
    if (!human.hasFleetSunk() && !bot.hasFleetSunk()) {
      const HumanAttackResult = human.attack(bot, coord);

      if (HumanAttackResult.attackSuccess) {
        if (HumanAttackResult.shipHit) {
          botBoard.markHit(coord);
        } else {
          botBoard.markMiss(coord);
        }

        const BotAttackResult = bot.attack(human);
        setTimeout(() => {
          if (BotAttackResult.attackSuccess) {
            if (BotAttackResult.shipHit) {
              humanBoard.markHit(BotAttackResult.coord);
            } else {
              humanBoard.markMiss(BotAttackResult.coord);
            }
          }
        }, 250);
      }
    }

    if (human.hasFleetSunk()) console.log("Bot won!");
    if (bot.hasFleetSunk()) console.log("Human won!");
  };

  return {
    newGame,
    startGame,
  };
})();

export default Game;
