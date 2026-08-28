import Phaser from "phaser";

type InputKeys = Record<"left" | "right" | "up" | "down" | "sprint", Phaser.Input.Keyboard.Key>;

export class PlayerInput {
  private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private readonly keys: InputKeys;

  constructor(scene: Phaser.Scene) {
    const keyboard = scene.input.keyboard;
    if (!keyboard) throw new Error("Keyboard input is unavailable.");
    this.cursors = keyboard.createCursorKeys();
    this.keys = keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      sprint: Phaser.Input.Keyboard.KeyCodes.SHIFT,
    }) as InputKeys;
  }

  get left() { return this.cursors.left.isDown || this.keys.left.isDown; }
  get right() { return this.cursors.right.isDown || this.keys.right.isDown; }
  get up() { return this.cursors.up.isDown || this.keys.up.isDown; }
  get down() { return this.cursors.down.isDown || this.keys.down.isDown; }
  get sprint() { return this.cursors.shift.isDown || this.keys.sprint.isDown; }
  get jumpPressed() {
    return Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.keys.up);
  }
  get rightPressed() {
    return Phaser.Input.Keyboard.JustDown(this.cursors.right) || Phaser.Input.Keyboard.JustDown(this.keys.right);
  }
}
