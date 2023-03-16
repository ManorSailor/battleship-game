class Warship {
  #name;
  #health;
  #length;

  constructor(name, health, position) {
    this.#name = name;
    this.#health = health;
    this.#length = health;
    this.position = position;
  }

  get name() {
    return this.#name;
  }

  get health() {
    return this.#health;
  }

  get length() {
    return this.#length;
  }

  hasSunk() {
    return this.#health === 0;
  }

  takeHit() {
    if (this.#health > 0) this.#health--;
  }

  /**
   * Generate a ship position from the provided coordinate, 
   * @param {[x: int, y: int]} startCoord - Starting coordinate (inclusive)
   * @param {function} isOverlapping - function to check if a generated coordinate overlaps with another coordinate
   * @returns {Array<[x: int, y: int]> | null}
   */
  generatePosition(startCoord, isOverlapping) {
    const position = [];
    const calcCoord = this.#getCoordEquation();

    for (let i = 0; i < this.#length; i++) {
      const coord = calcCoord(startCoord, i);
      if (isOverlapping(coord)) return null;
      position.push(coord);
    }

    return position;
  }

  #getCoordEquation() {
    return this.orientation === "vertical"
      ? ([x, y], offset) => [x, y + offset]
      : ([x, y], offset) => [x + offset, y];
  }

  static new({ name, health, position = null }) {
    return new Warship(name, health, position);
  }

  /**
   * @param {Array<{name: string, health: int}>} shipData - Array of generic objects containing ship data
   * @returns {Warship[]}
   */
  static newFleet(shipData = []) {
    return shipData.map((ship) => Warship.new(ship));
  }
}

export default Warship;
