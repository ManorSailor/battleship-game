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

  /**
   * Find a ship by name. Note: It only searches the Dock for that ship
   * @param {string} shipName
   * @returns {Warship | undefined}
   */
  getShip(shipName) {
    return this.#dockedShips.get(shipName);
  }

  /**
   * Determines whether a ship exist at any of the provided coordinate(s)
   * @param  {[x: int, y: int] | [x: int, y: int][]} coords
   * @returns {boolean | null} returns null when coordinate(s) are invalid
   */
  hasShipAt(coords) {
    if (Array.isArray(coords) && coords.length) {
      coords = Array.isArray(coords[0]) ? coords : [coords];
      return coords.some((coord) => this.#occupiedCoords.has(coord.toString()));
    }
    return null;
  }

  /**
   * Deploy a ship to provided coordinate
   * @param {string} shipName
   * @param {[x: int, y: int]} startCoord
   * @returns {boolean}
   */
  deployShip(shipName, startCoord) {
    const ship = this.getShip(shipName);
    const position = ship?.generatePosition(startCoord);

    if (this.hasShipAt(position) || this.hasShipAt(position) === null)
      return false;

    this.#moveShipTo(ship, position);
    return true;
  }

  attackShipAt() {}

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
   * Move a ship from Dock to Ocean, placing it at provided position
   * @param {Warship} ship
   * @param {Array<[x: int, y: int]>} position
   */
  #moveShipTo(ship, position) {
    this.#dockedShips.delete(ship.name);
    position.forEach((coord) =>
      this.#occupiedCoords.set(coord.toString(), ship)
    );
    this.#deployedShips.push(ship);
    ship.setPosition(position);
  }

  /**
   * @param {Warship[]} ships - Array of Warship objects
   */
  static new(ships = null) {
    return new ShipManager(ships);
  }
}

export default ShipManager;
