class Warship {
  #name;
  #health;
  #length;
  #position;

  constructor(name, health, position) {
    this.#name = name;
    this.#health = health;
    this.#length = health;
    this.#position = position;
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

  get position() {
    return this.#position;
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
   * @returns {Array<[x: int, y: int]> | null}
   */
  generatePosition(startCoord) {
    const position = [];
    const calcCoord = this.#getCoordEquation();

    for (let i = 0; i < this.#length; i++) {
      const coord = calcCoord(startCoord, i);
      position.push(coord);
    }

    return position;
  }

  /**
   * Set ship's position. Note: Ship's position cannot be changed
   * @param {Array<[x: int, y: int]} position
   */
  setPosition(position) {
    if (!this.#position) {
      console.log(position)
      this.#position = position;
    }
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
