class Gameboard {
  #size;
  #board;
  #shipsMap;

  constructor(size) {
    this.#size = size;
    // Map<CoordStr: bool> - `true` indicates a hit whereas `false` indicates a miss. Board is gradually built as game is played
    this.#board = new Map();
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

  receiveAttack(coord) {
    if (!this.#isCoordValid(coord)) return false;
    if (this.#board.has(coord.toString())) return false;

    const ship = this.#shipAt(coord);
    
    if (ship) {
      ship.takeHit();
      this.#board.set(coord.toString(), true);
      return true;
    }

    this.#board.set(coord.toString(), false);
    return true;
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

  #shipAt(coord) {
    if (this.#shipsMap.size > 0) {
      const shipsData = [Array.from(...this.#shipsMap.entries())];
      
      // eslint-disable-next-line no-restricted-syntax
      for (const [coords, ship] of shipsData) {
        // eslint-disable-next-line no-restricted-syntax
        for (const [x, y] of coords) {
          if (x === coord[0] && y === coord[1]) {
            return ship;
          }
        }
      }
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
