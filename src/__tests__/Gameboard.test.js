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

describe("Gameboard: canPlaceShip", () => {
  const fakeShip = { length: 3 };
  const board = Gameboard.new(boardInfo);

  it("returns true when coordinates are in bounds", () => {
    expect(board.canPlaceShip(fakeShip, [1, 0])).toBe(true);
  });

  it("returns true when coordinates are partially in bounds", () => {
    expect(board.canPlaceShip(fakeShip, [7, 0])).toBe(true);
  });

  it("returns false when coordinates are out of bounds", () => {
    const outOfBounds = [boardInfo.size, boardInfo.size];
    expect(board.canPlaceShip(fakeShip, outOfBounds)).toBe(false);
  });

  it("returns false when coordinates are partially out of bounds", () => {
    const edgeCaseX = [8, 0];
    expect(board.canPlaceShip(fakeShip, edgeCaseX)).toBe(false);
  });

  it("returns false when coordinates are invalid", () => {
    expect(board.canPlaceShip(fakeShip, null)).toBe(false);
    expect(board.canPlaceShip(fakeShip, "")).toBe(false);
    expect(board.canPlaceShip(fakeShip, 5)).toBe(false);
    expect(board.canPlaceShip(fakeShip)).toBe(false);
  });
});

describe.skip("Gameboard: receiveAttack", () => {
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
