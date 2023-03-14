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

// describe.skip("ShipManager: deployShip", () => {
//   const fakeShip = { length: 3 };
//   const shipManager = ShipManager.new();

//   it("places ship at valid coordinate by accounting for its length", () => {
//     const position = shipManager.deployShip(fakeShip, [1, 0]);
//     const expectedPos = [[1, 0], [2, 0], [3, 0]]; // prettier-ignore
//     expect(position).toEqual(expectedPos);
//   });

//   it("ignores placing ship at occupied coordinates", () => {
//     expect(shipManager.deployShip(fakeShip, [1, 0])).toBeFalsy();
//     expect(shipManager.deployShip(fakeShip, [2, 0])).toBeFalsy();
//     expect(shipManager.deployShip(fakeShip, [3, 0])).toBeFalsy();
//   });

//   it("ignores placing ship when it overlaps another ship", () => {
//     const mockShip = { length: 5 };
//     expect(shipManager.deployShip(mockShip, [0, 0])).toBeFalsy();
//   });
// });

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

// describe.skip("ShipManager: hasShipAt", () => {
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
