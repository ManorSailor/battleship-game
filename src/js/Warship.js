class Warship {
  #name;
  #health;
  #length;

  constructor(name, health) {
    this.#name = name;
    this.#health = health;
    this.#length = health;
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

  static newShip({ name, health }) {
    return new Warship(name, health);
  }
}

export default Warship;
