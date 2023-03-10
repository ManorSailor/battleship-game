import Warship from "../js/Warship";

const shipInfo = { name: "TestShip", health: 1 };

describe("Warship", () => {
  let ship;

  beforeEach(() => {
    ship = Warship.newShip(shipInfo);
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

  it("updates the position correctly", () => {
    ship.position = [[0, 0]];
    expect(ship.position).toEqual([[0, 0]]);
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
