import Player from "./Player";

class Bot extends Player {
  constructor() {
    super("Bot");
  }

  attack(enemy) {
    let attackCoord = this.#generateAttack();
    let attackResult = super.attack(enemy, attackCoord);

    while (!attackResult.attackSuccess) {
      attackCoord = this.#generateAttack();
      attackResult = super.attack(enemy, attackCoord);
    }

    return attackResult;
  }

  #generateAttack() {
    return [
      Math.floor(Math.random() * super.board.size),
      Math.floor(Math.random() * super.board.size),
    ];
  }

  static new() {
    return new Bot();
  }
}

export default Bot;
