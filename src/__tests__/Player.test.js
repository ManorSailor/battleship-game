import Player from "../js/models/Player";

describe("Player", () => {
  const player = Player.new("Test Player");

  it("has proper public interface", () => {
    expect(player).toMatchObject({
      attack: expect.any(Function),
      placeShip: expect.any(Function),
      receiveAttack: expect.any(Function),
      hasDeployedFleet: expect.any(Function),
      hasFleetSunk: expect.any(Function),
    });
  });

  it("has a getter for board", () => {
    const getter = jest.spyOn(player, "board", "get");
    const { ...board } = player.board;

    expect(getter).toHaveBeenCalled();
    expect(board).toMatchObject({
      size: expect.any(Number),
      hasShipAt: expect.any(Function),
    });
  });
});

describe("Player: autoplace", () => {
  const player = Player.new("Test Player");

  it("successfully autoplace the ships", () => {
    player.autoplace();
    expect(player.hasDeployedFleet()).toBe(true);
  });
});
