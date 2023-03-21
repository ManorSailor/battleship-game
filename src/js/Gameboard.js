class Gameboard {
  #attackedCoords;

  constructor(size) {
    this.size = size;
    // Set<Coord: string> - List of coordinates which have been attacked
    this.#attackedCoords = new Set();
  }

  canPlaceShip(ship, coord) {
    if (!Gameboard.#isValidCoord(coord)) return false;

    return ship.orientation === "vertical"
      ? this.#isVerticallyBounded(coord, ship.length)
      : this.#isHorizontallyBounded(coord, ship.length);
  }

  canAttack(coord) {
    if (!Gameboard.#isValidCoord(coord) || this.#hasAttacked(coord))
      return false;

    this.#attackedCoords.add(coord.toString());
    return true;
  }

  #hasAttacked(coord) {
    return this.#attackedCoords.has(coord.toString());
  }

  #isHorizontallyBounded(coord, length) {
    const offsetX = coord[0] + length - 1;
    return offsetX >= 0 && offsetX < this.size;
  }

  #isVerticallyBounded(coord, length) {
    const offsetY = coord[1] + length - 1;
    return offsetY >= 0 && offsetY < this.size;
  }

  static #isValidCoord(coord) {
    return Array.isArray(coord);
  }

  static new({ size = 10 }) {
    return new Gameboard(size);
  }
}

export default Gameboard;
