import Gameboard from "../js/Gameboard";
import Warship from "../js/Warship";

const boardInfo = { size: 10 };

describe("Gameboard", () => {
  const board = Gameboard.newBoard(boardInfo);

  it("has proper public interface", () => {
    expect(board).toMatchObject({
      placeShip: expect.any(Function),
      receiveAttack: expect.any(Function),
      allSunk: expect.any(Function),
    });
  });

  it("reports correct size", () => {
    expect(board.size).toBe(boardInfo.size);
  });
});

describe("Gameboard: placeShip", () => {
  const ship = Warship.newShip({ name: "TestShip", health: 3 });
  const board = Gameboard.newBoard(boardInfo);

  it("places ship at valid coordinate by accounting for its length", () => {
    const position = board.placeShip(ship, [0, 0]);
    const expectedPos = [
      [0, 0],
      [1, 0],
      [2, 0],
    ];
    expect(position).toEqual(expectedPos);
  });

  it("ignores placing ship at invalid coordinate", () => {
    expect(board.placeShip(ship, null)).toBeFalsy();
    expect(board.placeShip(ship, "")).toBeFalsy();
    expect(board.placeShip(ship, 5)).toBeFalsy();
    expect(board.placeShip(ship)).toBeFalsy();
  });

  it("ignores placing ship at out of bounds coordinate", () => {
    const outOfBounds = [boardInfo.size * 2, boardInfo.size * 2];
    expect(board.placeShip(ship, outOfBounds)).toBeFalsy();
  });

  it("ignores placing ship when a ship is partially out of bounds", () => {
    const edgeCaseX = [8, 0];
    const edgeCaseY = [0, 8];

    expect(board.placeShip(ship, edgeCaseX)).toBeFalsy();
    expect(board.placeShip(ship, edgeCaseY)).toBeFalsy();
  });

  it("ignores placing ship at an occupied coordinate", () => {
    expect(board.placeShip(ship, [0, 0])).toBeFalsy();
  });

  it("ignores placing ship when it overlaps another ship", () => {
    const occupiedCoord1 = [1, 0];
    const occupiedCoord2 = [2, 0];

    expect(board.placeShip(ship, occupiedCoord1)).toBeFalsy();
    expect(board.placeShip(ship, occupiedCoord2)).toBeFalsy();
  });
});

describe("Gameboard: receiveAttack", () => {
  const board = Gameboard.newBoard(boardInfo);
  const mockShip = { length: 3, takeHit: jest.fn() };

  it("receives attack at passed coordinate", () => {
    const expectedResult = { attackSuccess: true, shipHit: false };
    expect(board.receiveAttack([3, 3])).toEqual(expectedResult);
  });

  it("notify the ship of hit if it exist at the passed coordinate", () => {
    board.placeShip(mockShip, [1, 0]);
    board.receiveAttack([1, 0]);
    expect(mockShip.takeHit).toHaveBeenCalled();
  });

  it("ignores attacks on previously attacked coordinates", () => {
    const expectedResult = { attackSuccess: false, shipHit: false };

    expect(board.receiveAttack([3, 3])).toEqual(expectedResult);
    expect(board.receiveAttack([1, 0])).toEqual(expectedResult);
  });

  it("ignores invalid coordinates", () => {
    const expectedResult = { attackSuccess: false, shipHit: false };

    expect(board.receiveAttack(null)).toEqual(expectedResult);
    expect(board.receiveAttack("")).toEqual(expectedResult);
    expect(board.receiveAttack(5)).toEqual(expectedResult);
    expect(board.receiveAttack()).toEqual(expectedResult);
  });
});

describe("Gameboard: allSunk", () => {
  const board = Gameboard.newBoard(boardInfo);

  // Create an array of ships which are already destroyed
  const stubShips = Array(3).fill({ length: 1, hasSunk: () => true });

  // Place them on the board
  stubShips.forEach((stubShip, i) => board.placeShip(stubShip, [i, i]));

  it("returns true when all ships are destroyed", () => {
    expect(board.allSunk()).toBeTruthy();
  });

  it("returns false when at least a single ship is alive", () => {
    // Add a ship which is alive
    board.placeShip({ length: 1, hasSunk: () => false }, [4, 4]);
    expect(board.allSunk()).toBeFalsy();
  });
});
