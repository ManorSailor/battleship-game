import Warship from "./Warship";

class ShipManager {
  #dockedShips;
  #deployedShips;
  #occupiedCoords;
  static #defaultFleet = [
    { name: "Carrier", health: 5 },
    { name: "BattleShip", health: 4 },
    { name: "Destroyer", health: 3 },
    { name: "Submarine", health: 3 },
    { name: "Patroller", health: 2 },
  ];

  constructor(ships) {
    this.#deployedShips = [];
    this.#occupiedCoords = new Map();
    this.#populateDock(ships);
  }

  get dockedShips() {
    return [...this.#dockedShips.values()];
  }

  get deployedShips() {
    return [...this.#deployedShips];
  }

  deployShip() {}

  attackShipAt() {}

  hasShipAt() {}

  hasDeployedFleet() {}

  hasFleetSunk() {}

  #populateDock(ships) {
    const fleet = ships ?? Warship.newFleet(ShipManager.#defaultFleet);

    const dockedShips = fleet.reduce((dock, ship) => {
      dock.set(ship.name, ship);
      return dock;
    }, new Map());

    this.#dockedShips = dockedShips;
  }

  /**
   * @param {Warship[]} ships - Array of Warship objects
   */
  static new(ships = null) {
    return new ShipManager(ships);
  }
}

export default ShipManager;
