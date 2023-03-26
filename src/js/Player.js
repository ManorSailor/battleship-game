import Gameboard from "./Gameboard";
import ShipManager from "./ShipManager";

class Player {
  #board;
  #shipManager;

  constructor(name) {
    this.name = name;
    this.#board = Gameboard.new({ size: 10 });
    this.#shipManager = ShipManager.new();
  }

  get board() {
    return {
      size: this.#board.size,
      hasShipAt: this.#shipManager.hasShipAt.bind(this.#shipManager),
    };
  }

  attack(enemy, coord) {
    return enemy.receiveAttack(coord);
  }

  receiveAttack(coord) {
    const boardStatus = this.#board.canEnemyAttack(coord);

    if (boardStatus.attackSuccess) {
      const shipStatus = this.#shipManager.attackShipAt(coord);
      return { ...boardStatus, ...shipStatus };
    }

    return boardStatus;
  }

  placeShip(shipName, coord) {
    const ship = this.#shipManager.getShip(shipName);

    if (ship && this.#board.canPlaceShip(ship, coord)) {
      return this.#shipManager.deployShip(shipName, coord);
    }

    return false;
  }

  hasDeployedFleet() {
    return this.#shipManager.hasDeployedFleet();
  }

  hasFleetSunk() {
    return this.#shipManager.hasFleetSunk();
  }

  autoplace() {
    // TODO: Make sure to reset state first
    let ship = this.#shipManager.getRandomShip();

    while (!this.#shipManager.hasDeployedFleet()) {
      const coord = [
        Math.floor(Math.random() * this.#board.size),
        Math.floor(Math.random() * this.#board.size),
      ];

      if (this.#board.canPlaceShip(ship, coord)) {
        const placed = this.placeShip(ship.name, coord);
        if (placed) {
          ship = this.#shipManager.getRandomShip();
        }
      }
    }
  }

  static new(name) {
    return new Player(name);
  }
}

export default Player;
