import ShipManager from "../js/models/ShipManager";

describe("ShipManager", () => {
  const testShips = [
    { name: "Ship 1", health: 3 },
    { name: "Ship 2", health: 4 },
  ];
  const shipManager = ShipManager.new(testShips);

  it("has proper public interface", () => {
    expect(shipManager).toMatchObject({
      deployShip: expect.any(Function),
      attackShipAt: expect.any(Function),
      hasShipAt: expect.any(Function),
      hasDeployedFleet: expect.any(Function),
      hasFleetSunk: expect.any(Function),
      getShip: expect.any(Function),
      getRandomShip: expect.any(Function),
    });
  });

  it("has a getter for docked ships", () => {
    const getter = jest.spyOn(shipManager, "dockedShips", "get");
    const [...dockedShips] = shipManager.dockedShips;

    expect(getter).toHaveBeenCalled();
    expect(dockedShips).toEqual(testShips);
  });

  it("has a getter for deployed ships", () => {
    const getter = jest.spyOn(shipManager, "deployedShips", "get");
    const [...deployedShips] = shipManager.deployedShips;

    expect(getter).toHaveBeenCalled();
    expect(deployedShips).toEqual([]);
  });

  it("has a getter for the ship in transit", () => {
    const getter = jest.spyOn(shipManager, "shipInTransit", "get");
    const ship = shipManager.shipInTransit;

    expect(getter).toHaveBeenCalled();
    expect(ship).toEqual(testShips.at(-1));
  });
});

describe("ShipManager: hasShipAt", () => {
  const mockShips = [
    {
      name: "MockShip",
      generatePosition: () => [[1, 0], [2, 0], [3, 0]], // prettier-ignore
      setPosition: jest.fn(),
    },
    {
      name: "MockShip2",
      generatePosition: () => [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]], // prettier-ignore
      setPosition: jest.fn(),
    },
  ];
  const shipManager = ShipManager.new(mockShips);

  it("returns false when the coordinate is empty", () => {
    expect(shipManager.hasShipAt([1, 0])).toBe(false);
  });

  it("returns true when a ship exist at a coordinate", () => {
    shipManager.deployShip(mockShips[0].name, [1, 0]);
    expect(shipManager.hasShipAt([1, 0])).toBe(true);
  });

  it("returns true when a part of ship exist among the coordinates", () => {
    expect(shipManager.hasShipAt(mockShips[1].generatePosition())).toBe(true);
  });

  it("ignores invalid coordinates", () => {
    expect(shipManager.hasShipAt(null)).toBeNull();
    expect(shipManager.hasShipAt([])).toBeNull();
    expect(shipManager.hasShipAt("")).toBeNull();
    expect(shipManager.hasShipAt()).toBeNull();
  });
});

describe("ShipManager: deployShip", () => {
  const mockShips = [
    {
      name: "MockShip",
      generatePosition: () => [[1, 0], [2, 0], [3, 0]], // prettier-ignore
      setPosition: jest.fn(),
    },
    {
      name: "MockShip2",
      generatePosition: () => [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]], // prettier-ignore
      setPosition: jest.fn(),
    },
  ];
  const shipManager = ShipManager.new(mockShips);

  it("deploys a ship correctly", () => {
    expect(shipManager.deployShip(mockShips[0].name, [1, 0])).toBe(true);
  });

  it("deployed ship is no longer at docks", () => {
    expect(shipManager.dockedShips).not.toContainEqual(mockShips[0]);
  });

  it("deployed ship has moved to target location", () => {
    expect(shipManager.deployedShips).toContainEqual(mockShips[0]);
  });

  it("notifies the ship of deployment", () => {
    // this is an example of Outgoing Command! Sandi Metz tips have been quite helpful
    expect(mockShips[0].setPosition).toHaveBeenCalledTimes(1);
  });

  it("ignores deployment if there is an overlap", () => {
    expect(shipManager.deployShip(mockShips[1].name, [0, 0])).toBe(false);
    expect(shipManager.deployShip(mockShips[1].name, [1, 0])).toBe(false);
    expect(shipManager.deployShip(mockShips[1].name, [2, 0])).toBe(false);
    expect(shipManager.deployShip(mockShips[1].name, [3, 0])).toBe(false);
  });

  it("ignores deployment if ship is not at docks", () => {
    expect(shipManager.deployShip("DoesNotExist", [4, 4])).toBe(false);
  });
});

describe("ShipManager: attackShipAt", () => {
  const mockShips = [
    {
      name: "Sunk Mock Ship",
      generatePosition: () => [[0, 0], [1, 0], [2, 0]], // prettier-ignore
      setPosition: () => {},
      takeHit: jest.fn(),
      hasSunk: () => true,
    },
    {
      name: "Afloat Mock Ship",
      generatePosition: () => [[1, 1], [2, 1], [7, 1]], // prettier-ignore
      setPosition: () => {},
      takeHit: jest.fn(),
      hasSunk: () => false,
    },
  ];
  const shipManager = ShipManager.new(mockShips);
  mockShips.forEach((mockShip, i) =>
    shipManager.deployShip(mockShip.name, [i, i])
  );

  it("attacks ship if it exists at the coordinate", () => {
    const expectedResult = {
      shipHit: true,
      shipName: mockShips[0].name,
      shipSunk: mockShips[0].hasSunk(),
    };
    expect(shipManager.attackShipAt([0, 0])).toEqual(expectedResult);
  });

  it("ignores attack if ship doesn't exist at the coordinate", () => {
    expect(shipManager.attackShipAt([4, 4])).toEqual({ shipHit: false });
  });

  it("notify the ship of attack", () => {
    expect(mockShips[0].takeHit).toHaveBeenCalledTimes(1);
  });

  it("sunk ships are not counted as deployed", () => {
    expect(shipManager.deployedShips).not.toContainEqual(mockShips[0]);
  });

  it("afloat ships are counted as deployed", () => {
    expect(shipManager.deployedShips).toContainEqual(mockShips[1]);
  });
});

describe("ShipManager: hasDeployedFleet", () => {
  const mockShip = {
    name: "Sunk Mock Ship",
    generatePosition: () => [[0, 0], [1, 0], [2, 0]], // prettier-ignore
    setPosition: () => {},
  };
  const shipManager = ShipManager.new([mockShip]);

  it("returns false when dock has ships", () => {
    expect(shipManager.hasDeployedFleet()).toBe(false);
  });

  it("returns true when dock has no ships", () => {
    shipManager.deployShip(mockShip.name, [0, 0]);
    expect(shipManager.hasDeployedFleet()).toBe(true);
  });
});

describe("ShipManager: hasDeployedFleet", () => {
  const mockShip = {
    name: "Sunk Mock Ship",
    generatePosition: () => [[0, 0]], // prettier-ignore
    setPosition: () => {},
    takeHit: () => {},
    hasSunk: () => true,
  };
  const shipManager = ShipManager.new([mockShip]);
  shipManager.deployShip(mockShip.name, [0, 0]);

  it("returns false when ship(s) are afloat", () => {
    expect(shipManager.hasFleetSunk()).toBe(false);
  });

  it("returns true when fleet has sunk", () => {
    shipManager.attackShipAt([0, 0]);
    expect(shipManager.hasFleetSunk()).toBe(true);
  });
});

describe("ShipManager: getRandomShip", () => {
  const mockShips = [
    {
      name: "Mock Ship",
      generatePosition: () => [[0, 0]], // prettier-ignore
      setPosition: () => {},
    },
    {
      name: "Mock Ship 2",
      generatePosition: () => [[1, 1]], // prettier-ignore
      setPosition: () => {},
    },
  ];
  const shipManager = ShipManager.new(mockShips);

  it("returns a random ship", () => {
    expect(mockShips).toContainEqual(shipManager.getRandomShip());
  });

  it("returns undefined when there are no docked ships", () => {
    mockShips.forEach((ship, i) => shipManager.deployShip(ship.name, [i, i]));
    expect(shipManager.getRandomShip()).toBeUndefined();
  });
});
