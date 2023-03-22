import Gameboard from "../js/Gameboard";

const boardInfo = { size: 10 };

describe("Gameboard", () => {
  const board = Gameboard.new(boardInfo);

  it("has proper public interface", () => {
    expect(board).toMatchObject({
      size: expect.any(Number),
      canPlaceShip: expect.any(Function),
      canEnemyAttack: expect.any(Function),
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

describe("Gameboard: canEnemyAttack", () => {
  const board = Gameboard.new(boardInfo);

  it("receives attack on coordinate", () => {
    expect(board.canEnemyAttack([3, 3])).toMatchObject({ attackSuccess: true });
  });

  it("ignores attacks on previously attacked coordinate", () => {
    const expectedResult = { attackSuccess: false };
    expect(board.canEnemyAttack([3, 3])).toMatchObject(expectedResult);
  });

  it("ignores invalid coordinates", () => {
    const expectedResult = { attackSuccess: false };
    expect(board.canEnemyAttack(null)).toMatchObject(expectedResult);
    expect(board.canEnemyAttack("")).toMatchObject(expectedResult);
    expect(board.canEnemyAttack(5)).toMatchObject(expectedResult);
    expect(board.canEnemyAttack()).toMatchObject(expectedResult);
  });
});
