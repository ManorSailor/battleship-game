class Gameboard {
  #size;
  #board;
  #shipsMap;

  constructor(size) {
    this.#size = size;
    // Map<CoordStr: bool> - `true` indicates a hit whereas `false` indicates a miss. Board is gradually built as game is played
    this.#board = new Map();
    // Map<CoordStr: Warship> - For keeping track of the ships & their position
    this.#shipsMap = new Map();
  }

  get size() {
    return this.#size;
  }

  canPlaceShip(ship, coord) {
    if (!Gameboard.#isValidCoord(coord)) return false;

    return ship.orientation === "vertical"
      ? this.#isVerticallyBounded(coord, ship.length)
      : this.#isHorizontallyBounded(coord, ship.length);
  }

  canAttack(coord) {
    if (!Gameboard.#isValidCoord(coord))
      return { attackSuccess: false, shipHit: false };
    if (this.#board.has(coord.toString()))
      return { attackSuccess: false, shipHit: false };

    const ship = this.#shipAt(coord);

    if (ship) {
      ship.takeHit();
      this.#board.set(coord.toString(), true);
      return { attackSuccess: true, shipHit: true };
    }

    this.#board.set(coord.toString(), false);
    return { attackSuccess: true, shipHit: false };
  }

  #isHorizontallyBounded(coord, length) {
    const offsetX = coord[0] + length - 1;
    return offsetX >= 0 && offsetX < this.#size;
  }

  #isVerticallyBounded(coord, length) {
    const offsetY = coord[1] + length - 1;
    return offsetY >= 0 && offsetY < this.#size;
  }

  #isCoordOccupied(coord) {
    if (this.#shipsMap.size > 0) {
      const occupiedCoords = [...this.#shipsMap.keys()];
      return occupiedCoords.some((shipCoord) =>
        shipCoord.includes(coord.toString())
      );
    }
    return false;
  }

  #shipAt(coord) {
    if (this.#shipsMap.size > 0) {
      const shipsData = [...this.#shipsMap.entries()];

      // eslint-disable-next-line no-restricted-syntax
      for (const [coords, ship] of shipsData) {
        if (coords.includes(coord.toString())) {
          return ship;
        }
      }
    }

    return false;
  }

  static #calcShipCoords([x, y], shipLength) {
    return [...Array(shipLength).keys()].map((i) => [x + i, y]);
  }

  static #isValidCoord(coord) {
    return Array.isArray(coord);
  }

  static new({ size = 10 }) {
    return new Gameboard(size);
  }
}

export default Gameboard;
