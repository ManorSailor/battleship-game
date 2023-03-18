import ShipManager from "../js/ShipManager";

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


// describe.skip("ShipManager: attackShipAt", () => {
//   const board = ShipManager.new();
//   // const mockShip = { length: 3, takeHit: jest.fn() };

//   it("receives attack at passed coordinate", () => {
//     const expectedResult = { attackSuccess: true, shipHit: false };
//     expect(board.receiveAttack([3, 3])).toEqual(expectedResult);
//   });

//   it("ignores attacks on previously attacked coordinates", () => {
//     const expectedResult = { attackSuccess: false, shipHit: false };

//     expect(board.receiveAttack([3, 3])).toEqual(expectedResult);
//     expect(board.receiveAttack([1, 0])).toEqual(expectedResult);
//   });
// });

// describe.skip("ShipManager: hasDeployedFleet", () => {
//   const shipManager = ShipManager.new();

//   // Create an array of ships which are already destroyed
//   const stubShips = Array(3).fill({ length: 1, hasSunk: () => true });

//   // Place them on the board
//   stubShips.forEach((stubShip, i) => shipManager.deployShip(stubShip, [i, i]));

//   it("returns true when all ships are destroyed", () => {
//     expect(shipManager.allSunk()).toBeTruthy();
//   });

//   it("returns false when at least a single ship is alive", () => {
//     // Add a ship which is alive
//     shipManager.deployShip({ length: 1, hasSunk: () => false }, [4, 4]);
//     expect(shipManager.allSunk()).toBeFalsy();
//   });
// });
