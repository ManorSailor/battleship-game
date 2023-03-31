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

  get shipInTransit() {
    return this.dockedShips.at(-1);
  }

  /**
   * Returns a random ship. Note: Only looks at the Docks
   * @returns {Warship | undefined}
   */
  getRandomShip() {
    const ships = this.dockedShips;
    return ships.at(Math.random() * ships.length);
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
   * Determines whether the fleet has been deployed
   * @returns {boolean}
   */
  hasDeployedFleet() {
    return this.#dockedShips.size === 0;
  }

  /**
   * Determines whether the fleet has sunk
   * @returns {boolean}
   */
  hasFleetSunk() {
    return this.#deployedShips.length === 0;
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

  /**
   * Performs a fake deployment of the provided ship. Note: Required for showing ship preview
   * @param {string} shipName
   * @param {[x: int, y: int]} startCoord
   * @returns {[x: int, y: int][] | []}
   */
  fakeDeployShip(shipName, startCoord) {
    const ship = this.getShip(shipName);
    const position = ship?.generatePosition(startCoord);

    if (this.hasShipAt(position) || this.hasShipAt(position) === null)
      return [];

    return position;
  }

  /**
   * Attacks a ship if it exist at provided coordinate
   * @param {[x: int, y: int]} coord
   * @returns {{shipHit: boolean, shipName: string | undefined, shipSunk: boolean | undefined}}
   */
  attackShipAt(coord) {
    const ship = this.#getShipAt(coord);

    if (ship) {
      this.#hitShip(ship);
      return { shipHit: true, shipName: ship.name, shipSunk: ship.hasSunk() };
    }

    return { shipHit: false };
  }

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
   * Finds a ship if it exists at provided coordinate
   * @param {[x: int, y: int]} coord
   * @returns {Warship | undefined}
   */
  #getShipAt(coord) {
    return this.#occupiedCoords.get(coord.toString());
  }

  /**
   * Hits the passed ship, removing it from the ocean if sunk
   * @param {Warship} ship
   */
  #hitShip(ship) {
    ship.takeHit();

    if (ship.hasSunk()) {
      this.#deployedShips = this.#deployedShips.filter(
        (depShip) => depShip.name !== ship.name
      );
    }
  }

  /**
   * @param {Warship[]} ships - Array of Warship objects
   */
  static new(ships = null) {
    return new ShipManager(ships);
  }
}

export default ShipManager;
