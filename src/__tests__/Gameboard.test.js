import Gameboard from "../js/Gameboard";

const boardInfo = { size: 10 };

describe("Gameboard", () => {
  const board = Gameboard.new(boardInfo);

  it("has proper public interface", () => {
    expect(board).toMatchObject({
      canPlaceShip: expect.any(Function),
      canAttack: expect.any(Function),
    });
  });

  it("reports correct size", () => {
    expect(board.size).toBe(boardInfo.size);
  });
});

describe("Gameboard: placeShip", () => {
  const fakeShip = { length: 3 };
  const board = Gameboard.new(boardInfo);

  it("places ship at valid coordinate by accounting for its length", () => {
    const position = board.canPlaceShip(fakeShip, [1, 0]);
    const expectedPos = [[1, 0], [2, 0], [3, 0]]; // prettier-ignore
    expect(position).toEqual(expectedPos);
  });

  it("ignores placing ship at invalid coordinate", () => {
    expect(board.canPlaceShip(fakeShip, null)).toBeFalsy();
    expect(board.canPlaceShip(fakeShip, "")).toBeFalsy();
    expect(board.canPlaceShip(fakeShip, 5)).toBeFalsy();
    expect(board.canPlaceShip(fakeShip)).toBeFalsy();
  });

  it("ignores placing ship at out of bounds coordinate", () => {
    const outOfBounds = [boardInfo.size * 2, boardInfo.size * 2];
    expect(board.canPlaceShip(fakeShip, outOfBounds)).toBeFalsy();
  });

  it("ignores placing ship when a ship is partially out of bounds", () => {
    const edgeCaseX = [8, 0];
    const edgeCaseY = [0, 8];

    expect(board.canPlaceShip(fakeShip, edgeCaseX)).toBeFalsy();
    expect(board.canPlaceShip(fakeShip, edgeCaseY)).toBeFalsy();
  });

  it("ignores placing ship at occupied coordinates", () => {
    expect(board.canPlaceShip(fakeShip, [1, 0])).toBeFalsy();
    expect(board.canPlaceShip(fakeShip, [2, 0])).toBeFalsy();
    expect(board.canPlaceShip(fakeShip, [3, 0])).toBeFalsy();
  });

  it("ignores placing ship when it overlaps another ship", () => {
    const mockShip = { length: 5 };
    expect(board.canPlaceShip(mockShip, [0, 0])).toBeFalsy();
  });
});

describe("Gameboard: receiveAttack", () => {
  const board = Gameboard.new(boardInfo);
  const mockShip = { length: 3, takeHit: jest.fn() };

  it("receives attack at passed coordinate", () => {
    const expectedResult = { attackSuccess: true, shipHit: false };
    expect(board.canAttack([3, 3])).toEqual(expectedResult);
  });

  it("notify the ship of hit if it exist at the passed coordinate", () => {
    board.canPlaceShip(mockShip, [1, 0]);
    board.canAttack([1, 0]);
    expect(mockShip.takeHit).toHaveBeenCalled();
  });

  it("ignores attacks on previously attacked coordinates", () => {
    const expectedResult = { attackSuccess: false, shipHit: false };

    expect(board.canAttack([3, 3])).toEqual(expectedResult);
    expect(board.canAttack([1, 0])).toEqual(expectedResult);
  });

  it("ignores invalid coordinates", () => {
    const expectedResult = { attackSuccess: false, shipHit: false };

    expect(board.canAttack(null)).toEqual(expectedResult);
    expect(board.canAttack("")).toEqual(expectedResult);
    expect(board.canAttack(5)).toEqual(expectedResult);
    expect(board.canAttack()).toEqual(expectedResult);
  });
});
