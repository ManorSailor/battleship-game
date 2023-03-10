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

  static newShip({ name, health, position = null }) {
    return new Warship(name, health, position);
  }
}

export default Warship;
