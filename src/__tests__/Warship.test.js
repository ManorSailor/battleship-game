import Warship from "../js/models/Warship";

const shipInfo = { name: "TestShip", health: 1 };

describe("Warship", () => {
  let ship;

  beforeEach(() => {
    ship = Warship.new(shipInfo);
  });

  it("has proper interface", () => {
    expect(ship).toMatchObject({
      name: expect.anything(),
      health: expect.anything(),
      length: expect.anything(),
      position: expect.any(Object),
      takeHit: expect.any(Function),
      hasSunk: expect.any(Function),
    });
  });

  it("reports correct name", () => {
    expect(ship.name).toBe(shipInfo.name);
  });

  it("reports correct health", () => {
    expect(ship.health).toBe(shipInfo.health);
  });

  it("reports null position before setting position", () => {
    expect(ship.position).toBeNull();
  });

  it("floats when health is above 0", () => {
    expect(ship.hasSunk()).toBeFalsy();
    expect(ship.health).toBeGreaterThan(0);
  });

  it("taking damage reduces health", () => {
    const oldHealth = ship.health;
    ship.takeHit();
    expect(ship.health).toBeLessThan(oldHealth);
  });

  it("sinks when health is 0", () => {
    ship.takeHit();
    expect(ship.hasSunk()).toBeTruthy();
  });

  it("drowned ships do not take damage", () => {
    // Sink the ship
    ship.takeHit();
    expect(ship.hasSunk()).toBeTruthy();

    // Make sure it doesn't take damage again
    ship.takeHit();
    expect(ship.health).not.toBeLessThan(0);
  });
});

describe("Warship: newFleet", () => {
  const shipData = [
    { name: "Ship 1", health: 3 },
    { name: "Ship 2", health: 4 },
  ];

  it("generates a fleet correctly", () => {
    Warship.newFleet(shipData).forEach((ship) =>
      expect(ship).toBeInstanceOf(Warship)
    );
  });
});

describe("Warship: generatePosition", () => {
  const ship = Warship.new({ name: "TestShip", health: 3 });

  it("generates a horizontal position correctly", () => {
    const mockOverlapChecker = () => false;
    const expectedCoords = [[0, 0], [1, 0], [2, 0]]; // prettier-ignore

    expect(ship.generatePosition([0, 0], mockOverlapChecker)).toEqual(
      expectedCoords
    );
  });

  it.todo("generates a vertical position correctly");
});

describe("Warship: setPosition", () => {
  const ship = Warship.new({ name: "TestShip", health: 3 });

  it("sets the position correctly", () => {
    ship.setPosition([[0, 0]]);
    expect(ship.position).toEqual([[0, 0]]);
  });

  it("ignores updating position", () => {
    ship.setPosition([[4, 0]]);
    expect(ship.position).not.toEqual([[4, 0]]);
  });
});