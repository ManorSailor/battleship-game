class Gameboard {
  #size;
  #shipsMap;

  constructor(size) {
    this.#size = size;
    // Map<Coord[]: Warship> - For keeping track of the ships & their position
    this.#shipsMap = new Map();
  }

  get size() {
    return this.#size;
  }

  placeShip(ship, startCoord) {
    if (!this.#isCoordValid(startCoord)) return false;
    if (!this.#isCoordValid([startCoord[0] + ship.length - 1, 0])) return false;
    if (!this.#isCoordValid([0, startCoord[1] + ship.length - 1])) return false;
    if (this.#isCoordOccupied(startCoord)) return false;

    const shipCoords = Gameboard.#calcShipCoords(startCoord, ship.length);
    this.#shipsMap.set(shipCoords, ship);
    return shipCoords;
  }

  receiveAttack() {
    return this;
  }

  #isCoordValid(coord) {
    const [x = -1, y = -1] = Array.isArray(coord) ? coord : [];
    const isBounded = (n) => n >= 0 && n < this.#size;
    return isBounded(x) && isBounded(y);
  }

  #isCoordOccupied(coord) {
    if (this.#shipsMap.size > 0) {
      const occupiedCoords = Array.from(...this.#shipsMap.keys());
      return occupiedCoords.some(([x, y]) => x === coord[0] && y === coord[1]);
    }
    return false;
  }

  static #calcShipCoords([x, y], shipLength) {
    return [...Array(shipLength).keys()].map((i) => [x + i, y]);
  }

  static newBoard({ size = 10 }) {
    return new Gameboard(size);
  }
}

export default Gameboard;
